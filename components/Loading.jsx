import React from 'react';
import { Triangle } from 'react-loader-spinner';

const Loading = () => {
    return (
        <div className='flex items-center justify-center h-[100vh] w-[100vw]'>
            <Triangle 
                height="120"
                width="120"
                color="#f97316"
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
            />
        </div>
    )
}

export default Loading