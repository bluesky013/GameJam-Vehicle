import { _decorator, Component, Node, RigidBody, Quat, Vec3, Camera, CCBoolean, NodeSpace, quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('missile')
export class missile extends Component {
    @property(Node)
    public target: Node = null;

    @property(Camera)
    public missil: Camera = null;

    @property(Camera)
    public missi2: Camera = null;

    @property(Camera)
    public main: Camera = null;

    @property
    public switchCamera: boolean = true;

    private acc = 5.0;
    private currentSpeed: number = 0.0;
    private maxSpeed: number = 10.0;
    private radius = 100;
    private startPos: Vec3 = new Vec3(-this.radius, -1, -this.radius);
    private lanched: boolean = true;
    private angularSpeed: number = 2;

    reset() {
        const quat = new Quat();
        Quat.fromEuler(quat, 0, 0, 90);

        this.node.setRotation(quat);
        this.node.setWorldPosition(this.startPos);
        this.currentSpeed = 0;
        // const angle = Math.random() * Math.PI - Math.PI / 2;
        // this.startPos.x = this.radius * Math.cos(angle);
        // this.startPos.z = this.radius * Math.sin(angle);
        // this.startPos.y = -1;

        this.missil.node.active = false;
        this.missi2.node.active = false;
        this.main.node.active = true;
    }

    start() {
        this.reset();
    }

    update(deltaTime: number) {
        if (!this.lanched) {
            return false;
        }

        const pos = this.node.getWorldPosition();
        const rot = this.node.getWorldRotation();

        const targetPos = Vec3.copy(new Vec3(),this.target.getWorldPosition());
        const targetPos2 = Vec3.add(new Vec3(), targetPos, new Vec3(0, 10, 0));
    
        let heading = Vec3.transformQuat(new Vec3(), Vec3.UNIT_X, rot);
        heading.normalize();

        let targetDir1 = Vec3.subtract(new Vec3(), targetPos, pos);
        let targetDir2 = Vec3.subtract(new Vec3(), targetPos2, pos);
        let targetDir = targetDir1;

        if (targetDir.length() < 2) {
            this.reset();
            let impulse = Vec3.add(new Vec3(), targetDir, new Vec3(0, 0.5, 0));
            impulse.multiplyScalar(200);
            let rigidbody = this.target.getComponent(RigidBody);
            rigidbody.applyImpulse(impulse);
            return;
        } else if (targetDir.length() < 15 && this.switchCamera) {
            // this.missil.node.active = true;sewese
            // this.missi2.node.active = false;
            // this.main.node.active = false;
        } else if (targetDir.length() < 20 && this.switchCamera) {
            // this.missil.node.active = false;
            // this.missi2.node.active = true;
            // this.main.node.active = false;
        } else {
            // this.missil.node.active = false;
            // this.missi2.node.active = false;
            // this.main.node.active = true;
        }
        
        if (targetDir.length() > 20) {
            targetDir = targetDir2;
        }
        targetDir.normalize();

        const quat = Quat.rotationTo(new Quat(), heading, targetDir);
        let dot = Vec3.dot(heading, targetDir);
        const dotAngle = Math.acos(dot);
        const angularSpeed = Math.min(this.angularSpeed, this.currentSpeed * 0.2);
        const angle = Math.min(dotAngle, angularSpeed * deltaTime);

        this.currentSpeed += this.acc * deltaTime;
        if (this.currentSpeed >= this.maxSpeed) {
            this.currentSpeed = this.maxSpeed;
        }
        
        this.node.rotate(Quat.slerp(new Quat(), Quat.IDENTITY, quat, 1 - angle / dotAngle));
        this.node.translate(new Vec3(this.currentSpeed * deltaTime, 0, 0), NodeSpace.LOCAL);

        const position = this.node.getWorldPosition();
        if (position.x >= 200 || position.x <= -200 || position.y >= 200 || position.y <= -50 || position.z >= 200 || position.z <= -200) {
            this.reset();
            return;
        }
    }
}


