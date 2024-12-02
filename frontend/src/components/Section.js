import React from 'react';

const Section = ({ title, children }) => (
  <>
    {title && <h2 className="mb-4">{title}</h2>}
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {children}
    </div>
  </>
);

export default Section;
