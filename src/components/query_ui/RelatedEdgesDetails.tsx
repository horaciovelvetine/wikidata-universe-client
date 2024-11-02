import './RelatedEdgesDetails.css'
import { VertexSel, Vertex as VertIcon } from '../../assets/icons';
import { createRef, FC, useEffect, useState } from 'react';

import { Edge, EDGE_DIR, SketchManager, Vertex } from '../../models';
import { edgeDirectionIcon } from '..';


interface RelatedEdgesDetailsDisplayProps {
  selectedVertex: Vertex | null;
  sketchRef: SketchManager | null;
}

const prfx = (sufx: string) => {
  return 'related-edges-details-' + sufx;
}

export const RelatedEdgesDetails: FC<RelatedEdgesDetailsDisplayProps> = ({ selectedVertex, sketchRef }) => {
  const [relatedEdges, setRelatedEdges] = useState<Edge[]>([]);

  const displayRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (!selectedVertex || !sketchRef) {
      setRelatedEdges([]);
      displayRef.current!.style.transform = 'translateY(200%)';
    } else {
      setRelatedEdges(sketchRef.GRAPH().getRelatedEdges(selectedVertex))
      if (relatedEdges.length != 0) {
        displayRef.current!.style.transform = 'translateY(0)';
      }
      displayRef.current!.style.transform = 'translateY(200%)'; //catches swap between sketch and about sketch
    }
  }, [selectedVertex, sketchRef?.GRAPH()])

  return (
    <div id={prfx('display')} ref={displayRef} onWheel={(e) => { e.stopPropagation() }}>
      <div id={prfx('cont')} onWheel={(e) => { e.stopPropagation() }}>
        <ul id={prfx('list')} onWheel={(e) => { e.stopPropagation() }}>
          {selectedVertex &&
            relatedEdges.map((edge, index) =>
            (<EdgeDetail
              key={index}
              {...{ edge, sketchRef, selectedVertex, relatedEdges }}
            />))}
        </ul>
      </div>
    </div>
  );
};

interface EdgeDetailProps {
  edge: Edge;
  sketchRef: SketchManager | null;
  selectedVertex: Vertex;
  relatedEdges: Edge[];
}

const EdgeDetail: FC<EdgeDetailProps> = ({ edge, sketchRef, selectedVertex, relatedEdges }) => {
  if (sketchRef == null) return;

  const altVertexId = edge.srcId == selectedVertex.id ? edge.tgtId : edge.srcId;
  if (!altVertexId) return;

  const property = sketchRef.GRAPH().getProperty(edge.propertyId);
  if (!property) return;

  const altVertex = sketchRef.GRAPH().getVertex(altVertexId)
  if (!altVertex) return;

  const isParalellEdge = selectedVertex.parallelEdges(altVertex, edge, relatedEdges);
  const edgeDirection = isParalellEdge!.length > 0 ? EDGE_DIR.PARALLEL : edge.getEdgeDirection(selectedVertex!);
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
    <li id={prfx('edge')} onWheel={(e) => { e.stopPropagation() }}>
      <a id={prfx('cur-sel-vert')} onClick={() => sketchRef.CAM().setLookAtTgt(selectedVertex.coords)}>
        <img id={prfx('cur-sel-vert-icon')} src={VertexSel} alt='represents current selected vertex' />
      </a>
      <a id={prfx('prop-cont')} href={property.url()} target='_blank'>
        <p id={prfx('property')} className={propertyTextColor()}>{property.label}</p>
        <img id={prfx('dir-icon')} src={icon} alt='edge type icon indication' />
      </a>
      <a id={prfx('alt-vert-cont')} onClick={() => sketchRef.CAM().setLookAtTgt(altVertex.coords)}>
        <img id={prfx('alt-vert-icon')} src={VertIcon} alt='represents alternate vertex' />
        <p id={prfx('alt-vert-lbl')}>{altVertex.label}</p>
      </a>
    </li>
  )
}