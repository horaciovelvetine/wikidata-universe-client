import './related-edge-item.css'
import { Vertex as NoVertSel, VertexSel } from '../../../../../assets/icons';
import { FC } from "react";

import { Edge, Vertex, WikiverseSketch } from '../../../../../types';
import { getEdgeDirectionIcon } from '../../../../../utils/get-edge-direction-icon';
import { useConstants } from '../../../../../app';


interface RelatedEdgeItemProps {
  edge: Edge;
  sketchRef: WikiverseSketch
  curSelectedRef: Vertex;
  relEdges: Edge[]
}

const ID = (sufx: string) => `edge-item-${sufx}`

export const RelatedEdgeItem: FC<RelatedEdgeItemProps> = ({ edge, sketchRef, curSelectedRef, relEdges }) => {
  const { _bl } = useConstants()
  const alt = sketchRef.graphset.getAltVertex(edge, curSelectedRef)
  const prop = sketchRef.graphset.getProperty(edge.propertyId)
  const { dir, icon } = getEdgeDirectionIcon(curSelectedRef, edge, relEdges)

  const onVertexIconClick = (vert: Vertex | null) => {
    if (!vert) return;
    sketchRef.CAM().setLookAtTgt(vert.coords);
  }

  return (
    <li className={ID('container')}>
      <img src={VertexSel} className={ID('cur-vert-icon')} onClick={() => onVertexIconClick(curSelectedRef)} />
      <img src={icon} className={ID('dir-icon')} />

      <a href={prop?.url()} target={_bl} className={ID('property-source-link')}>
        <p className={ID(`property-label-${dir}`)}>{prop?.label}</p>
      </a>

      <img src={icon} className={ID('dir-icon')} />
      <span className={ID('alt-topic-span')} onClick={() => onVertexIconClick(alt)}>
        <img src={NoVertSel} className={ID('alt-vert-icon')} />
        <p className={ID('tgt-label')}>{alt?.label}</p>
      </span>
    </li>
  )
}