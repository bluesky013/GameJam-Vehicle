import { _decorator, Component, Node, Mesh, primitives, MeshRenderer, Material, RigidBody, SphereCollider, Vec3, Quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('basketball')
export class basketball extends Component {

    @property(Node)
    public target: Node = null;

    @property(Node)
    public bomb: Node = null;

    private time: number = null;
    private lifeTime: number = 5;

    start() {
        this.reset();
    }

    reset() {
        this.time = 0;

        this.bomb.setPosition(Vec3.ZERO);

        const dir = Vec3.subtract(new Vec3(), this.target.worldPosition, this.node.worldPosition);
        dir.y += 5;
        Vec3.normalize(dir, dir);
        
        const rb = this.bomb.getComponent(RigidBody);
        rb.clearState();
        rb.applyImpulse(dir.multiplyScalar(35));
    }

    update(deltaTime: number) {
        this.time += deltaTime;
        if (this.time >= this.lifeTime) {
            this.reset();
        }
    }
}


