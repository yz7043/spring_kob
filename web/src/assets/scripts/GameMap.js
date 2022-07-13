import { GameObject } from "./GameObject";
import { Wall } from "@/assets/scripts/Wall";
export class GameMap extends GameObject{
    constructor(ctx, parent){
        super();
        this.ctx = ctx;
        this.parent = parent;
        this.L = 0;
        this.rows = 13;
        this.cols = 13;

        this.walls = []
        this.inner_walls_count = 20;
        this.innerWalls = []
    }
    
    start(){
        for(let i = 0; i < 1000; i++)
            if(this.create_walls()) break;
    }

    update(){
        this.update_map();
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
                if(g[r][c] || g[c][r]) continue;
                // avoid occupying rebirth point
                if(r == this.rows-2 && c == 1 || c == this.cols-2 && r == 1) continue;
                g[r][c] = true;
                g[c][r] = true;
                break;
            }
        }

        if(!this.check_connectivity(g)) return false;

        for(let r = 0; r < this.rows; r++){
            for(let c = 0; c < this.rows; c++){
                if(g[r][c]){
                    this.walls.push(new Wall(r, c, this));
                }
            }
        } 

        return true;
    }
}