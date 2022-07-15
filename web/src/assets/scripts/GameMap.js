import { GameObject } from "./GameObject";
import { Wall } from "@/assets/scripts/Wall";
import { Snake, SNAKE_STATUS } from "./Snake";
export class GameMap extends GameObject{
    constructor(ctx, parent){
        super();
        this.ctx = ctx;
        this.parent = parent;
        this.L = 0;
        this.rows = 13;
        this.cols = 14;

        this.walls = []
        this.inner_walls_count = 20;
        this.innerWalls = []
        this.snakes = [
            new Snake({id: 0, color: "#4876EC", r: this.rows - 2, c: 1}, this), 
            new Snake({id: 1, color: "#F94848", r: 1, c: this.cols - 2}, this)
        ];
    }
    
    start(){
        for(let i = 0; i < 1000; i++)
            if(this.create_walls()) break;
        this.add_listening_events();
    }

    update(){
        this.update_map();
        if(this.check_ready()){
            this.next_step();
        }
        this.render();
    }

    render(){
        const color_even = "#AAD751", color_odd = "#A2D149";
        for(let r = 0; r < this.rows; r++){
            for(let c = 0; c < this.cols; c++){
                if((r + c) % 2 ==0){
                    this.ctx.fillStyle = color_even;
                }else{
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);
            }
        }
    }

    update_map(){
        this.L = parseInt(Math.min(this.parent.clientWidth / this.rows, this.parent.clientHeight / this.cols));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    dfs(r, c, st){
        let dr = [1, 0, -1, 0];
        let dc = [0, 1, 0, -1];
        st[r][c] = true;
        for(let i = 0; i < 4; i++){
            let newR = dr[i] + r;
            let newC = dc[i] + c;
            if(newR >= 0 && newR < this.rows && newC >= 0 && newC < this.cols){
                if(!st[newR][newC]){
                    this.dfs(newR, newC, st);
                }
            }
        }
    }

    check_connectivity(g){
        let num_block = 0;
        const st = JSON.parse(JSON.stringify(g));
        for(let r = 0; r < this.rows; r++){
            for(let c = 0; c < this.cols; c++){
                if(!st[r][c]){
                    num_block++;
                    this.dfs(r, c, st);
                }
            }
        }
        return num_block === 1;
    }


    create_walls(){
        const g = []
        for(let r = 0; r < this.rows; r++){
            g[r] = [];
            for(let c = 0; c < this.rows; c++){
                g[r][c] = false;
            }
        }    
        // add walls to boundaries
        for(let r = 0; r < this.rows; r++){
            g[r][0] = g[r][this.cols-1] = true;
        }
        for(let c = 0; c < this.cols; c++){
            g[0][c] = g[this.rows-1][c] = true;
        }
        // create random walls
        for(let i = 0; i < this.inner_walls_count / 2; i++){
            // avoid duplicated wall and infinite loop
            for(let j = 0; j < 1000; j++){
                let r = parseInt(Math.random() * this.rows);
                let c = parseInt(Math.random() * this.cols);
                if(g[r][c] || g[this.rows-1-r][this.cols-1-c]) continue;
                // avoid occupying rebirth point
                if(r == this.rows-2 && c == 1 || c == this.cols-2 && r == 1) continue;
                g[r][c] = true;
                g[this.rows-1-r][this.cols-1-c] = true;
                break;
            }
        }

        if(!this.check_connectivity(g)) return false;

        for(let r = 0; r < this.rows; r++){
            for(let c = 0; c < this.cols; c++){
                if(g[r][c]){
                    this.walls.push(new Wall(r, c, this));
                }
            }
        } 
        return true;
    }

    check_ready(){
        for(const snake of this.snakes){
            // hasn't finished moving
            if(snake.status !== SNAKE_STATUS.IDLE) return false;
            // no command is issued
            if(snake.direction === -1) return false;
        }
        return true;
    }

    next_step(){
        for(const snake of this.snakes){
            snake.next_step();
        }    
    }

    add_listening_events(){
        // let outer = this;
        this.ctx.canvas.focus();
        const [snake0, snake1] = this.snakes;
        this.ctx.canvas.addEventListener("keydown", e => {
            if(e.key === "w"){
                snake0.set_direction(0);
            }else if(e.key === "d"){
                snake0.set_direction(1); 
            }else if(e.key === "s"){
                snake0.set_direction(2);
            }else if(e.key === "a"){
                snake0.set_direction(3);
            }else if(e.key === "ArrowUp"){
                snake1.set_direction(0);
            }else if(e.key === "ArrowRight"){
                snake1.set_direction(1); 
            }else if(e.key === "ArrowDown"){
                snake1.set_direction(2);
            }else if(e.key === "ArrowLeft"){
                snake1.set_direction(3);
            }
        });
    }
    
    check_valid(cell){
        for(const wall of this.walls){
            if(wall.r == cell.r && wall.c == cell.c) return false;
        }
        for(const snake of this.snakes){
            let k = snake.cells.length;
            if(!snake.check_tail_increasing()){
                // if tail doesn't grow, head won't touch tail after moving
                k--;
            }
            for(let i = 0; i < k; i++){
                if(snake.cells[i].r === cell.r && snake.cells[i].c === cell.c)
                    return false;
            }
        }
        return true;
    }
}