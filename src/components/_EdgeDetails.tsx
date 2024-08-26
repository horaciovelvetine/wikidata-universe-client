import './_EdgeDetailsStyle.css'

import React from "react";
import { Vertex as VertIcon } from '../assets/icons'
import { edgeDirectionIcon } from './util';
import { Edge, Vertex } from '../p5/models';
import { SketchData, EDGE_DIR } from '../interfaces';

interface EdgeDetailsProps {
  edge: Edge;
  data: SketchData | null;
  selectedVertex: Vertex | null;
  relatedEdges: Edge[];
}

export const EdgeDetails: React.FC<EdgeDetailsProps> = ({ edge, data, selectedVertex, relatedEdges }) => {
  const property = edge.getPropertyDetails(data!);
  if (property == undefined) return; //todo -> refactors for animateable version
  const endpoints = edge.getVertexEndpoints(data!);
  const otherVert = endpoints.src.id == selectedVertex?.id ? endpoints.tgt : endpoints.src;
  const parallelEdges = selectedVertex?.parallelEdges(otherVert, edge, relatedEdges)
  if (parallelEdges == undefined) return; //todo -> refactors for animateable version
  const edgeDirection = parallelEdges!.length > 0 ? EDGE_DIR.PARALLEL : edge.getEdgeDirection(selectedVertex!);
  const icon = edgeDirectionIcon(edgeDirection);

  return (
    <>
      <div id='edge-details'>
        <img id='vertex-icon' src={VertIcon} alt='represents current selected vertex' />
        <p id='property-text'>{property.label}</p>
        <img id='edge-type-icon' src={icon} alt='parallel edge' />
        <img id='vertex-icon' src={VertIcon} alt='represents current selected vertex' />
        <p id='property-text'>{otherVert.label}</p>
      </div>
    </>
  )
}