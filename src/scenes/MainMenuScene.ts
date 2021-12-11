
import {
	createWorld,
	Types,
	defineComponent,
	defineQuery,
	addEntity,
	addComponent,
	defineSystem,
	IWorld,
	System
  } from 'bitecs'
import { IWorldDefinition } from 'matter'

const Vector3 = { x: Types.f32, y: Types.f32, z: Types.f32 }
const Position = defineComponent(Vector3)
const posQuery = defineQuery([Position])

const world = createWorld()

const createDummySystem = (scene:Phaser.Scene)=>{
	return defineSystem((world,...args:any[])=>{
		const positionEntities = posQuery(world);
		for(let i = 0;i<positionEntities.length;i++){
			console.log('Id:',positionEntities[i]);
		}
		return world;
	});
}
const timeSystem = world => {
	const { time } = world
	const now = performance.now()
	const delta = now - time.then
	time.delta = delta
	time.elapsed += delta
	time.then = now
	return world
  }

export default class MainMenuScene extends Phaser.Scene {
	
	backgroundGradient:Phaser.GameObjects.Graphics;
	private world:IWorld;
	private dummySystem:System;
    constructor() {
		super("MainMenuScene"); 
		this.world = world;
		
		const e = addEntity(world);
		addComponent(world,Position,e);
		Position.x[e]=10;
		Position.y[e]=100;
		Position.z[e]=100;
		
		this.dummySystem = createDummySystem(this);

	}

    init(): void {
		
	}

	create(): void {
		this.backgroundGradient = this.add.graphics();
		this.backgroundGradient.fillGradientStyle(0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 1);
		this.backgroundGradient.fillRect(0,0,this.scale.width,this.scale.height)
	}

	update(){
		this.dummySystem(this.world,"dwadaw",1,234,2,2,5);
	}

}