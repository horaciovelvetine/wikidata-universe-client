import './_EdgeDetailsStyle.css'

import React from "react";
import { ArrowBoth, Vertex as VertexIcon } from '../assets/icons'
import { edgeDirectionIcon } from './util';
import { Vertex, Property } from '../p5/models';
import { iEdge } from '../interfaces';

interface EdgeDetailsProps {
  edge: iEdge;
  srcVertex: Vertex;
  tgtVertex: Vertex;
  property: Property
}

export enum EDGE_TYPE {
  TO, FROM, PARALLEL
}

export const EdgeDetails: React.FC<EdgeDetailsProps> = ({ tgtVertex, property }) => {

  return (
    <div id='edge-details'>
      <img id='vertex-icon' src={VertexIcon} alt='vertex picture for currently selected vertex' />
      <img id='edge-icon' src={ArrowBoth} alt='parallel edge' />
      <p>label: {tgtVertex.label}</p>
      <p>property: {property.label}</p>
    </div>)
}