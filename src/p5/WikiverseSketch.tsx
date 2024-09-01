
import CharisTTF from "../assets/font/CharisSIL-Regular.ttf";
import { P5CanvasInstance, ReactP5Wrapper, Sketch } from "@p5-wrapper/react";
import { Camera, Font } from "p5";

import { calcInitLayoutDimensions, traceRay, drawSketchUI } from "./functions";
import { Vertex, LookAtChange } from "./models";
import { clickTargetMatchesCurrentSelection, vertexInSelectedHistory } from "./util";

import { SketchData } from "../interfaces";
import { postRelatedDataQueue } from "../api";


interface WikiverSketchProps {
  curQuery: string;
  sketchData: SketchData; // used to init then becomes stale(!!!)
  setHoveredVertex: React.Dispatch<React.SetStateAction<Vertex | null>>
  setSelectedVertex: React.Dispatch<React.SetStateAction<Vertex | null>>;
  setSketchData: React.Dispatch<React.SetStateAction<SketchData>>;
  setLookAtRef: React.Dispatch<React.SetStateAction<LookAtChange | undefined>>
}

export const WikiverseSketch: React.FC<WikiverSketchProps> = ({ curQuery, sketchData, setSelectedVertex, setSketchData, setLookAtRef, setHoveredVertex }) => {
  // SKETCH 
  let wikiFont: Font;
  let cam: Camera;
  const lookAt: LookAtChange = new LookAtChange(null)
  // DATA
  let hoveredVertex: Vertex | null = null;
  let selectedVertex: Vertex | null = null;
  let selectedHistory: Vertex[] = [];
  let session = sketchData;

  console.log('initSketchData()=', sketchData)

  const postRelatedPayload = () => {
    return {
      query: curQuery,
      dimensions: calcInitLayoutDimensions(),
      vertices: sketchData.vertices,
      edges: sketchData.edges,
      properties: sketchData.properties,
      queue: sketchData.queue
    }
  }

  const WikiverseSketch: Sketch = (p5: P5CanvasInstance) => {
    p5.preload = () => { wikiFont = p5.loadFont(CharisTTF); };
    p5.setup = async () => {
      const { width, height } = calcInitLayoutDimensions();
      p5.createCanvas(width, height, p5.WEBGL);
      p5.textFont(wikiFont!); //set in preload

      cam = p5.createCamera();
      if (curQuery != '') {
        const originVertex = new Vertex(sketchData?.vertices[0])
        selectedVertex = originVertex
        setSelectedVertex(originVertex)

        const { x, y, z } = originVertex.coords
        cam.setPosition(x, y, (z + 150));
        cam.lookAt(0, 0, 0); // start somewhere move to origin...
        lookAt.setTarget(originVertex.coords);
      }

      setLookAtRef(lookAt)

      if (curQuery != '') {
        //
        //TODO SHOULD BE REMOVEABLE AS FULL APP INITS (W/ SEARCH FIRST)
        //
        const relatedRes = await postRelatedDataQueue(postRelatedPayload())
        session = relatedRes.data;
      }
      setSketchData(session)
    };

    //* ==>      <== *//
    //* ==> DRAW <== *//
    //* ==>      <== *//
    p5.draw = () => {
      drawSketchUI(p5, session, curQuery);
      if (curQuery == '') return;

      if (!!selectedVertex) {
        selectedVertex.drawLabel(p5, cam!, wikiFont!);
        selectedVertex.drawRelatedEdges(p5, session);
      }

      if (!!hoveredVertex) {
        hoveredVertex.drawLabel(p5, cam!, wikiFont!);
        hoveredVertex.drawRelatedEdges(p5, session, true);
      }

      session.vertices.forEach((vDat) => {
        new Vertex(vDat).draw(p5, selectedVertex);
      });

      if (lookAt.animInProgress()) {
        const { x, y, z } = lookAt.changeVec(p5, cam!);
        cam!.lookAt(x, y, z)
        lookAt.advance();
      }
    };

    //* ==>       <== *//
    //* ==> CLICK <== *//
    //* ==>       <== *//
    p5.mouseClicked = () => {
      if (curQuery == '') return;
      session.vertices.forEach((vertexData) => {
        const vert = new Vertex(vertexData);
        if (!traceRay(p5, cam!, vert)) return; // vertex is not click target

        // Deselect current vertex
        if (clickTargetMatchesCurrentSelection(selectedVertex, vert)) {
          selectedVertex = null;
          setSelectedVertex(null);
          return;
        }

        // Select new Vertex
        lookAt.setTarget(vert.coords);
        hoveredVertex = null;
        setHoveredVertex(null);
        selectedVertex = vert;
        setSelectedVertex(vert);
        // Fetch new Vertex details...
        if (vert.label == curQuery) return; // origin already fetched...
        if (vertexInSelectedHistory(selectedHistory, vert)) return;
        selectedHistory.push(vert);
        console.log('look for new details...')
      })
    };

    //* ==>       <== *//
    //* ==> HOVER <== *//
    //* ==>       <== *//
    p5.mouseMoved = () => {
      if (curQuery == '') return;
      if (hoveredVertex != null) {
        if (traceRay(p5, cam!, hoveredVertex)) return; // same vertex still hovered
      }

      let foundHoveredVert = false;
      session.vertices.forEach(vert => {
        const checkVert = new Vertex(vert);
        if (selectedVertex?.id == checkVert.id) return; // ignore currently selected
        if (traceRay(p5, cam!, checkVert)) {
          setHoveredVertex(checkVert);
          hoveredVertex = checkVert;
          foundHoveredVert = true;
        }
      });
      if (!foundHoveredVert) {
        setHoveredVertex(null);
        hoveredVertex = null;
      }
    };

    //* ==>        <== *//
    //* ==> RESIZE <== *//
    //* ==>        <== *//
    p5.windowResized = () => {
      const { width, height } = calcInitLayoutDimensions();
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