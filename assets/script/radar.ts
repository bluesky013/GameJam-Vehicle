import { _decorator, Component, Mat4, Node, Quat, Vec2, Vec3, Vec4 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Radar')
export class Radar extends Component {

    @property(Node)
    public missile: Node = null;

    @property(Node)
    public car: Node = null;

    @property
    public angle: number = 45 / 180.0 * 3.14;
    public currentAngle: number = 0;
    public pos: Vec2 = new Vec2(1000, 1000);

    public curr1: number = 0;
    public curr2: number = 0;

    private rotationSpeed: number = 2.0;
    start() {

    }

    update(deltaTime: number) {
        const rotate = this.rotationSpeed * deltaTime;
        this.currentAngle += rotate;
        const m = Math.floor(this.currentAngle / Math.PI / 2.0);

        this.curr1 = this.currentAngle - this.angle / 2 - m * 2 * Math.PI;
        this.curr2 = this.currentAngle + this.angle / 2 - m * 2 * Math.PI;

        this.node.rotate(Quat.fromAxisAngle(new Quat(), Vec3.UNIT_Y, rotate));
        if (this.missile == null) {
            return;
        }

        const inverse = Mat4.invert(new Mat4(), this.car.worldMatrix);
        const inverseTrans = Vec3.transformMat4(new Vec3(), this.missile.worldPosition, inverse);

        let pos = new Vec2(inverseTrans.x, inverseTrans.z);
        let dirv2 = Vec2.normalize(new Vec2(), pos);

        let dot = Vec2.dot(dirv2, Vec2.UNIT_X);
        const current = Math.acos(dot);
        if (current >= this.curr1 && current <= this.curr2) {
            this.pos = pos;
        }
    }
}


