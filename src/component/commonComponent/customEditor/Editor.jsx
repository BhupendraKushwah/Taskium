import React from 'react'
import { Controller } from 'react-hook-form';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';

const Editor = ({ name, control }) => {

  return (
    <div className='w-full'>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange } }) => (
          <ReactQuill
            onChange={onChange}
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean'],
              ],
            }}
            theme="snow"
            style={{ width: '100%' }}
          />
        )}
      />
    </div>
  )
}

export default Editor