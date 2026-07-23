import React, { useEffect } from 'react';

const useTittle = (title) => {
    useEffect(() => {
        document.title = `Focus Hub - ${title}`;
    }, [title]);
};

export default useTittle;