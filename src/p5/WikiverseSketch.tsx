
import CharisTTF from "../assets/font/CharisSIL-Regular.ttf";
import { P5CanvasInstance, ReactP5Wrapper, Sketch } from "@p5-wrapper/react";
import { Camera, Font } from "p5";

import { calcSafeDimensions, setupCameraView, traceRay, drawSketchUI } from "./functions";
import { Vertex, LookAtChange } from "./models";

import CharlesSessionDataR2 from '../assets/data/charles-data-r1-2.json'
import { SessionData } from "../interfaces";
import { postRelatedDataClick } from "../api";



const sessionData = (): SessionData => {
  return {
    err: null,
    query: CharlesSessionDataR2.query,
    vertices: CharlesSessionDataR2.vertices,
    edges: CharlesSessionDataR2.edges,
    properties: CharlesSessionDataR2.properties,
    queue: CharlesSessionDataR2.queue,
    dimensions: calcSafeDimensions()
  }
}

export const WikiverseSketch: React.FC = () => {
  // SKETCH 
  let wikiFont: Font;
  let cam: Camera;
  const lookAt: LookAtChange = new LookAtChange(null)
  // DATA
  let selectedVertex: Vertex | null;
  let hoveredVertex: Vertex | null;
  let session = sessionData();
  let clickedTargets: string[] = [];

  const WikiverseSketch: Sketch = (p5: P5CanvasInstance) => {

    //* ==>       <== *//
    //* ==> SETUP <== *//
    //* ==>       <== *//
    p5.preload = () => { wikiFont = p5.loadFont(CharisTTF); };
    p5.setup = () => {
      const { width, height } = calcSafeDimensions();
      p5.createCanvas(width, height, p5.WEBGL);
      p5.textFont(wikiFont!); //set in preload
      cam = setupCameraView(p5, cam);
      selectedVertex = null;
      hoveredVertex = null;
    };

    //* ==>      <== *//
    //* ==> DRAW <== *//
    //* ==>      <== *//
    p5.draw = () => {
      drawSketchUI(p5, session);

      if (!!selectedVertex) {
        selectedVertex.drawLabel(p5, cam!, wikiFont!);
        selectedVertex.drawRelatedEdges(p5, session);
      }

      if (!!hoveredVertex) {
        hoveredVertex.drawLabel(p5, cam!, wikiFont!);
        hoveredVertex.drawRelatedEdges(p5, session, true);
      }

      session.vertices.forEach((vDat) => {
        new Vertex(vDat).draw(p5);
      });

      if (lookAt.hasTarget() && lookAt.animInProgress()) {
        const vec = lookAt.changeVec(p5, cam!);
        cam!.lookAt(vec.x, vec.y, vec.z)
        lookAt.advance();
      }
    };

    //* ==>       <== *//
    //* ==> CLICK <== *//
    //* ==>       <== *//
    p5.mouseClicked = () => {
      session.vertices.forEach((vertexData) => {
        const vert = new Vertex(vertexData);
        const vertexClicked = traceRay(p5, cam!, vert);
        if (!vertexClicked) return;

        if (selectedVertex != null && selectedVertex.id == vert.id) {
          // Deselect current vertex
          selectedVertex = null;
          return;
        } else {
          // Select a new vertex
          const originalQuery = session.query;
          lookAt.setTarget(vert.coords);
          selectedVertex = vert;
          // Skip fetching things we've already clicked on
          if (clickedTargets.includes(vert.id)) return;

          // Fetch new related vertex data...
          postRelatedDataClick({ ...session, query: vert.label })
            .then(res => {
              clickedTargets.push(vert.id)
              session = { ...res.data as SessionData, query: originalQuery };
            }).catch(e => {
              console.log(e)
            });
        }
      })
    };

    //* ==>       <== *//
    //* ==> HOVER <== *//
    //* ==>       <== *//
    p5.mouseMoved = () => {
      if (hoveredVertex != null) {
        const isStillHoveredVert = traceRay(p5, cam!, hoveredVertex)
        if (isStillHoveredVert) return;
      }

      let foundHoveredVert = false;
      session.vertices.forEach(vert => {
        const checkVert = new Vertex(vert);
        if (selectedVertex?.id == checkVert.id) return;
        const newVertIsHovered = traceRay(p5, cam!, checkVert);

        if (newVertIsHovered) {
          hoveredVertex = checkVert;
          foundHoveredVert = true;
        }
      });
      if (!foundHoveredVert) {
        hoveredVertex = null;
      }
    };

    //* ==>        <== *//
    //* ==> RESIZE <== *//
    //* ==>        <== *//
    p5.windowResized = () => {
      const { width, height } = calcSafeDimensions();
      p5.resizeCanvas(width, height);
    };


    p5.keyPressed = (e: KeyboardEvent) => {
      if (e.key == "i") {
        console.log("currentSession", session);
      }
    }
  };

  return <ReactP5Wrapper sketch={WikiverseSketch} />;
};