import './_EdgeDetailsStyle.css'

import React from "react";
import { Vertex as VertIcon, VertexSel } from '../assets/icons'
import { edgeDirectionIcon } from './util';
import { Edge, Vertex } from '../p5/models';
import { SketchData, EDGE_DIR } from '../interfaces';

interface EdgeDetailsProps {
  edge: Edge;
  sketchData: SketchData | null;
  selectedVertex: Vertex | null;
  relatedEdges: Edge[];
  focusVertexHandler: (otherVert: Vertex) => void;
}

export const EdgeDetails: React.FC<EdgeDetailsProps> = ({ edge, sketchData, selectedVertex, relatedEdges, focusVertexHandler }) => {
  const property = edge.getPropertyDetails(sketchData!);
  if (property == undefined) return; //todo -> refactors for animateable version
  const endpoints = edge.getVertexEndpoints(sketchData!);
  const otherVert = endpoints.src.id == selectedVertex?.id ? endpoints.tgt : endpoints.src;
  const parallelEdges = selectedVertex?.parallelEdges(otherVert, edge, relatedEdges)
  if (parallelEdges == undefined) return; //todo -> refactors for animateable version
  const edgeDirection = parallelEdges!.length > 0 ? EDGE_DIR.PARALLEL : edge.getEdgeDirection(selectedVertex!);
  const icon = edgeDirectionIcon(edgeDirection);
  const propertyTextColor = () => {
    switch (edgeDirection) {
      case EDGE_DIR.INCOMING:
        return 'incoming'
      case EDGE_DIR.OUTGOING:
        return 'outgoing'
      default:
        return 'parallel'
    }
  }

  return (
    <>
      <div id='edge-details'>
        <a id='src-vert-container' onClick={() => focusVertexHandler(selectedVertex!)}>
          <img id='vertex-icon' src={VertexSel} alt='represents current selected vertex' />
        </a>
        <div id='property-container'>
          <p id='property-text' className={propertyTextColor()}>{property.label}</p>
          <img id='edge-type-icon' src={icon} alt='parallel edge' />
        </div>
        <a id='alt-vert-container' onClick={() => focusVertexHandler(otherVert)}>
          <img id='vertex-icon' src={VertIcon} alt='represents alternate vertex' />
          <p id='alt-vert-text'>{otherVert.label}</p>
        </a>
      </div>
    </>
  )
}