import React from 'react'
import { ThreeCircles } from 'react-loader-spinner'

const Spiner = () => {
    return (
        <ThreeCircles
            visible={true}
            height="100"
            width="100"
            color="#526cf1"
            ariaLabel="three-circles-loading"
        />
    )
}

export default Spiner