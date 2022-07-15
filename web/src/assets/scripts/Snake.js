import { GameObject } from "./GameObject";
import { Cell } from "./Cell";
export const SNAKE_STATUS = {IDLE: "idle", DIE: "die", MOVE: "move"};
export class Snake extends GameObject {
    constructor(info, gamemap){
        super();
        this.id = info.id;
        this.color = info.color;
        this.gamemap = gamemap;
        this.cells = [new Cell(info.r, info.c)]; // cells[0] is the head of the snake
        this.speed = 5;
        // 0 1 2 3 up right down left, -1 no command
        this.direction = -1; 
        this.status = SNAKE_STATUS.IDLE;
        this.next_cell = null
        this.dr = [-1, 0, 1, 0];
        this.dc = [0, 1, 0, -1];
        this.step = 0;
        this.eps = 1e-2;

        this.eye_direction = (this.id === 0) ? 0 : 2;
        this.eye_dx = [[-1, 1],[1, 1],[1, -1],[-1, -1]];
        this.eye_dy = [[-1, -1],[-1, 1],[1, 1],[1, -1]];
    }

    start(){}

    update(){
        if(this.status === SNAKE_STATUS.MOVE){
            this.update_move();
        }
        this.render();
    }

    update_move(){
        const move_dis = this.speed * this.timedelta / 1000;
        const dx = this.next_cell.x - this.cells[0].x;
        const dy = this.next_cell.y - this.cells[0].y;
        const dis = Math.sqrt(dx * dx + dy * dy);
        if(dis < this.eps){
            this.cells[0] = this.next_cell;
            this.status = SNAKE_STATUS.IDLE;
            this.next_cell = null;
            if(!this.check_tail_increasing()){
                this.cells.pop();
            }
        }else{
            this.cells[0].x += move_dis * dx / dis;
            this.cells[0].y += move_dis * dy / dis;
            if(!this.check_tail_increasing()){
                const k = this.cells.length;
                const tail = this.cells[k-1], tail_target = this.cells[k-1];
                const tail_dx = tail_target.x - tail.x;
                const tail_dy = tail_target.y - tail.y;
                tail.x += move_dis * tail_dx / dis;
                tail.y += move_dis * tail_dy / dis;
            }
        }
    }

    next_step(){
        const d = this.direction;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);
        this.direction = -1;
        this.status = SNAKE_STATUS.MOVE;
        this.step++;
        this.eye_direction = d; 
        const k = this.cells.length;
        for(let i = k; i > 0; i--){
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i-1]));
        }
        if(!this.gamemap.check_valid(this.next_cell)){
            this.status = SNAKE_STATUS.DIE;
        }        
    }

    render(){
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;
        ctx.fillStyle = this.color;
        if(this.status === SNAKE_STATUS.DIE){
            ctx.fillStyle = "white";
        }
        for(const cell of this.cells){
            ctx.beginPath();
            ctx.arc(cell.x * L, cell.y * L, L / 2 * 0.8, 0, 2 * Math.PI);
            ctx.fill();
        }
        for(let i = 1; i < this.cells.length; i++){
            const c1 = this.cells[i-1], c2 = this.cells[i];
            if(Math.abs(c1.x - c2.x) < this.eps && Math.abs(c1.y - c2.y) < this.eps) continue;
            if(Math.abs(c1.x - c2.x) < this.eps){
                ctx.fillRect((c1.x - 0.4) * L, Math.min(c1.y, c2.y) * L, L * 0.8, Math.abs(c1.y - c2.y) * L);
            }
            if(Math.abs(c1.y - c2.y) < this.eps){
                ctx.fillRect(Math.min(c1.x, c2.x) * L, (c1.y - 0.4) * L, Math.abs(c1.x - c2.x) * L, L * 0.8);
            }
        }
        ctx.fillStyle = "black";
        for(let i = 0; i < 2; i++){
            const eye_x = this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15;
            const eye_y = this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15;
            ctx.beginPath();
            ctx.arc(eye_x * L, eye_y * L, L * 0.05, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    set_direction(d){
        this.direction = d;
    }

    check_tail_increasing(){
        if(this.step < 10) return true;
        if(this.step % 3 === 1) return true;
        return false;
    }
}