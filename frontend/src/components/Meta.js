import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({ title, description, keywords, image }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
      <meta property="og:image" content={image}/>
      <meta property="og:description" content={description}/>
      <meta property="og:title" content={title}/>
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'AF ZONES',
  description: 'We sell the best products for cheap',
  keywords: 'furniture, buy furniture, cheap furniture',
  image: 'AamirFurniture.ico'
}

export default Meta
