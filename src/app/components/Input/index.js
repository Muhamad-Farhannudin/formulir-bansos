import React from 'react';
import PropTypes from 'prop-types';

export default function Input({ type, value, name, onChange, min}) {
  return (
    <input type={type} value={value} name={name} onChange={onChange} min={min} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-1'/>
  )
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}
