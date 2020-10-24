import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import './Infobox.css'
function Infobox({title,cases,total,active, isRecovered, isCases, isDeaths, ...props}) {
    return (
        <Card 
            className={`infoBox ${active && 'infoBox--selected'} ${isCases && 'infoBox--red'} ${isDeaths && 'infoBox--orange'}`} 
            onClick = {props.onClick}
            >
            <CardContent>
                <Typography className='infoBoc__title' color='textSecondary'>
                    {title}
                </Typography>
                <h2 
                    className={`infoBox__cases ${isRecovered && 'infoBox--recovered'} ${isCases && 'infoBox--red'} ${isDeaths && 'infoBox--orange'}` }>
                    {cases}
                </h2>
                <Typography className='infoBoc__total' color='textSecondary'>
                    {total} Total
                </Typography>
            </CardContent>            
        </Card>
    )
}

export default Infobox
