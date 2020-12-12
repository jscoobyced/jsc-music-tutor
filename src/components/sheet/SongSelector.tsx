import React from 'react';

export const SheetSelector = (props: {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}) => {

  return (
    <select className='sheet-selector' onChange={props.onChange}>
      <option value='random'>Random</option>
      <option value='mary'>Mary Had A Little Lamb</option>
    </select>
  );
}