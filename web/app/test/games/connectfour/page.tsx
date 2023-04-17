"use client"
import Sketch from "react-p5"
import p5types from "p5"

const cW = 600
const ch = 500
const sizeModules = 40
var modules: number[] = []
let p5: p5types
export default function CONNECTFOURPAGE() {
	const setup = (p: p5types, canvasRef) => {
		p.createCanvas(cW, ch).parent(canvasRef)
		p5 = p
		p.rectMode("center")
		p.background(255)
	}
	const draw = (p: p5types) => {
		p.noFill()
		for (let i = sizeModules / 2; i < cW; i += sizeModules) {
			for (let j = sizeModules / 2; j < ch; j += sizeModules) {
				p.strokeWeight(1)
				p.rect(i, j, sizeModules, sizeModules)
				modules.push(i, j)
			}
		}
		p.mouseMoved = (e) => {
			drawModule(e.x, e.y)
		}
	}
	const drawModule = (x: number, y: number) => {
		for (let m = 0; m < modules.length; m += 2) {
			for (let n = 0; n < modules.length; m += 2) {
				if (x > modules[m] - sizeModules / 2 && x < modules[m] + sizeModules / 2 && y > modules[n] - sizeModules / 2 && y < modules[n] + sizeModules / 2) {
					p5.ellipse(modules[m], modules[n], 10, 10)
				}
			}
		}
	}
	return (
		<>
			<Sketch setup={setup} draw={draw} />
		</>
	)
}
