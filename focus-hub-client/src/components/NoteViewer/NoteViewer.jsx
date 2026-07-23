import React, { useEffect, useRef } from 'react';
import "katex/dist/katex.min.css";
import { renderMath } from '../../utils/renderMath';

const NoteViewer = ({html}) => {
   const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.innerHTML = html;
    renderMath(ref.current);
  }, [html, ref]);

  return <div ref={ref} />;
};

export default NoteViewer;