import './RelatedEdgesDetails.css'
import { VertexSel, Vertex as VertIcon } from '../../assets/icons';
import { createRef, FC, useEffect, useState } from 'react';

import { Edge, EDGE_DIR, Graphset, Point3D, Vertex } from '../../models';
import { edgeDirectionIcon } from '..';


interface RelatedEdgesDetailsDisplayProps {
  selectedVertex: Vertex | null;
  graphset: Graphset | null;
  refocusCameraHandler: (tgt: Point3D) => void;
}

const prfx = (sufx: string) => {
  return 'related-edges-details-' + sufx;
}

export const RelatedEdgesDetails: FC<RelatedEdgesDetailsDisplayProps> = ({ selectedVertex, graphset, refocusCameraHandler }) => {
  const [relatedEdges, setRelatedEdges] = useState<Edge[]>([]);

  const displayRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (!displayRef.current) return;
    const transition = 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)';
    displayRef.current.style.transition = transition;

    if (!selectedVertex || !graphset) {
      setRelatedEdges([]);
      displayRef.current.style.transform = 'translateY(200%)';
    } else {
      displayRef.current.style.transform = 'translateY(0)';
      setRelatedEdges(graphset.getRelatedEdges(selectedVertex))
    }
  }, [selectedVertex, graphset])

  return (
    <div id={prfx('display')} ref={displayRef} onWheel={(e) => { e.stopPropagation() }}>
      <div id={prfx('cont')} onWheel={(e) => { e.stopPropagation() }}>
        <ul id={prfx('list')} onWheel={(e) => { e.stopPropagation() }}>
          {graphset && selectedVertex &&
            relatedEdges.map((edge, index) =>
            (<EdgeDetail
              key={index}
              {...{ edge, graphset, selectedVertex, relatedEdges, refocusCameraHandler }}
            />))}
        </ul>
      </div>
    </div>
  );
};

interface EdgeDetailProps {
  edge: Edge;
  graphset: Graphset;
  selectedVertex: Vertex;
  relatedEdges: Edge[];
  refocusCameraHandler: (tgt: Point3D) => void;
}

const EdgeDetail: FC<EdgeDetailProps> = ({ edge, graphset, selectedVertex, relatedEdges, refocusCameraHandler }) => {
  const altVertexId = edge.srcId == selectedVertex.id ? edge.tgtId : edge.srcId;
  const property = graphset.getProperty(edge.propertyId);
  const altVertex = graphset.getVertex(altVertexId!)
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
      <a id={prfx('cur-sel-vert')} onClick={() => refocusCameraHandler(selectedVertex.coords)}>
        <img id={prfx('cur-sel-vert-icon')} src={VertexSel} alt='represents current selected vertex' />
      </a>
      <a id={prfx('prop-cont')} href={property.url()} target='_blank'>
        <p id={prfx('property')} className={propertyTextColor()}>{property.label}</p>
        <img id={prfx('dir-icon')} src={icon} alt='edge type icon indication' />
      </a>
      <a id={prfx('alt-vert-cont')} onClick={() => refocusCameraHandler(altVertex.coords)}>
        <img id={prfx('alt-vert-icon')} src={VertIcon} alt='represents alternate vertex' />
        <p id={prfx('alt-vert-lbl')}>{altVertex.label}</p>
      </a>
    </li>
  )
}