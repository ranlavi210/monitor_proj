import React, {Component} from "react"; 


export class Monitor extends Component{
    constructor(props){
        super(props);
        this.state = {got_res: false, apiResponse:"", visual:false}; //got_res - flag that true when the request from api successed
                                                                     //apiResponse - the response from api
                                                                    // visual - flag that indicates abous user will of display
    }

    callAPI(){       
        fetch("http://localhost:9000/cons_app")
            .then(res => res.text())
            .then(res => this.setState({apiResponse: JSON.parse(res), got_res: true}));            
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
        if(!this.state.visual)
        {
            txt_disp.push(<h1>Altitude is: {this.state.got_res ? this.state.apiResponse.Alt2send: "non exist" } </h1>);
            txt_disp.push(<h1>HIS is: {this.state.got_res ? this.state.apiResponse.HIS2send : "non exist" } </h1>);
            txt_disp.push(<h1>AID is: {this.state.got_res ? this.state.apiResponse.AID2send : "non exist" } </h1>);
        }
        return txt_disp;      
    }

    visual_display() 
    {
        var vis_disp =[];
        if(this.state.visual)
        {
           // to complete
        }
        return vis_disp
    }

    render(){
        return(
            <div>
                <button onClick={this.refresh}>refresh page</button><br /><br />
                <button onClick={() => this.setState({visual:true})}>visual</button><br />
                <button onClick={() => this.setState({visual:false})}>text</button>

                <div>{this.text_display()}</div>
                <div>{this.visual_display()}</div>
            </div>            
        );
    }
}

export default Monitor;
