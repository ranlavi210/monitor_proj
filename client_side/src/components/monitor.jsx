import React, {Component, useState} from "react"; 
import { createRoot } from 'react-dom/client';
import { Stage, Layer, Rect, Text, Circle, Line , Arrow} from 'react-konva';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';


export class Monitor extends Component{
    constructor(props){
        super(props);
        this.state = {got_res: false, apiResponse:{alt:0,HIS:0,AID:0}, visual:true}; //got_res - flag that true when the request from api successed
                                                                                     //apiResponse - the response from api
                                                                                     // visual - flag that indicates abous user will of display
        setInterval(this.callAPI, 10000); //for request data from api every 10 seconds
    }

    callAPI = () => { 
        fetch("http://localhost:9000/cons_app")
            .then(res => res.text())
            .then(res => this.setState({apiResponse: {alt: JSON.parse(res).Alt2send, HIS: JSON.parse(res).HIS2send, AID: JSON.parse(res).AID2send}, got_res: true}));       
            
    }

    componentWillMount(){
       this.callAPI();        
    }

    refresh()
    {
        window.location.reload(false);
    }

    text_display() 
    {
        var txt_disp =[];
        txt_disp.push(<h3>Altitude is: {this.state.got_res ? this.state.apiResponse.alt: "non exist" } </h3>);
        txt_disp.push(<h3>HIS is: {this.state.got_res ? this.state.apiResponse.HIS : "non exist" } </h3>);
        txt_disp.push(<h3>AID is: {this.state.got_res ? this.state.apiResponse.AID : "non exist" } </h3>);
        return txt_disp;      
    }

    visual_display() 
    {
        let vis_disp;
        let alt = this.state.apiResponse.alt;
        let HIS = this.state.apiResponse.HIS;
        let AID = this.state.apiResponse.AID;
        if(this.state.got_res)
            vis_disp = (<Stage width={window.innerWidth} height={window.innerHeight}>{this.draw_alt(alt)}{this.draw_HIS(HIS)}{this.draw_AID(AID)}
                    </Stage>);
        else
            vis_disp = <h3>non exist</h3>
        return vis_disp
    }

    draw_alt(alt)
    {
        let rect_x_point = 70;
        let rect_y_point = 50;
        let rect_width = 40;
        let rect_height = 200;
        return (
            <Layer>    
            <Rect
            x={rect_x_point}
            y={rect_y_point}
            width={rect_width}
            height={rect_height}s
            fill="gray"
            shadowBlur={7}
            />
            <Text x={rect_x_point} y={rect_y_point -30} text="Altitude" fontSize={15} />
            <Text x={rect_x_point} y={rect_y_point} text="3000" fontSize={15} />
            <Text x={rect_x_point} y={rect_y_point + rect_height*0.3} text="2000" fontSize={15} />
            <Text x={rect_x_point} y={rect_y_point + rect_height*0.63} text="1000" fontSize={15} />
            <Text x={rect_x_point} y={rect_y_point + rect_height*0.92} text="0" fontSize={15}/>
            <Line 
            x={rect_x_point-0.2*rect_width}
            y={(rect_y_point+(1-alt/3000)*rect_height)}
            points={[0, 0, 1.4*rect_width, 0]}
            tension={0.2}
            closed
            stroke="black"
            />
            <Text x={rect_x_point+1.3*rect_width} y={rect_y_point+(1-alt/3000)*rect_height-7.5} text={alt} fontSize={15} />
            </Layer>
            );          
    }

    draw_HIS(HIS)
    {
        let radius = 100;
        let circle_x_point = 350;
        let circle_y_point = 160;
        return( <Layer>
                <Text x={circle_x_point - 0.1*radius} y={circle_y_point - radius - 30} text="HIS" fontSize={15} />
                <Circle x={circle_x_point} y={circle_y_point} radius={radius} fill="orange" tension={0.5} closed stroke="black"/>
                <Text x={circle_x_point + this.x_projection(radius,HIS)} y={circle_y_point + this.y_projection(radius,HIS)} text="*90" fontSize={15} />
                <Text x={circle_x_point + this.x_projection(radius,HIS-90)} y={circle_y_point + this.y_projection(radius,HIS-90)} text="*180" fontSize={15} />
                <Text x={circle_x_point + this.x_projection(radius,HIS-180)} y={circle_y_point + this.y_projection(radius,HIS-180)} text="*270" fontSize={15} />
                <Text x={circle_x_point + this.x_projection(radius,HIS-270)} y={circle_y_point + this.y_projection(radius,HIS-270)} text="*0" fontSize={15} />

                <Arrow points= {[circle_x_point,circle_y_point+0.2*radius, circle_x_point, circle_y_point -0.3*radius]} pointerLength= {20}
                        pointerWidth=  {10} fill= 'black' stroke= 'black' strokeWidth= {5} />
                </Layer>); 
    }
    x_projection(radius,angle)
    {
        return radius*Math.cos(this.to_radians(angle));
    }

    y_projection(radius,angle)
    {
        return -radius*Math.sin(this.to_radians(angle));
    }

    to_radians (angle)
    {
        return angle * (Math.PI / 180);
    }

    draw_AID(AID)
    {
        let circle_x_point = 680;
        let circle_y_point = 160;
        let radius  = 100;
        
        return(
            <Layer>
            <Text x={circle_x_point - 0.1*radius} y={circle_y_point - radius - 30} text="AID" fontSize={15} />            
            <Circle
            x={circle_x_point}
            y={circle_y_point}
            radius={radius}
        
            tension={0.5}
            closed
            stroke="black"            
            fillLinearGradientStartPoint={{ x:-0.6*radius-AID*1.4, y: 0 }} //i give green more influence beacause blue stronger
            fillLinearGradientEndPoint={{ x: radius-AID*1.4 , y: 0 }}
            fillLinearGradientColorStops={[0, 'green', 1, 'blue']}
            />
            </Layer>
        );
    }

    render(){
        return(
            <div>
                <Button variant="secondary" onClick={this.refresh}>refresh page</Button><br /><br />
                <Button variant="primary" disabled={this.state.visual} onClick={() => this.setState({visual:true})}>visual</Button><br />
                <Button variant="primary" disabled={!this.state.visual} onClick={() => this.setState({visual:false})}>text</Button>

                <h1>{this.state.visual? "Visual display:": "Text display:"}</h1>  
                <div>{this.state.visual ? this.visual_display() :this.text_display()}</div> 
            </div>            
        );
    }
}

export default Monitor;
