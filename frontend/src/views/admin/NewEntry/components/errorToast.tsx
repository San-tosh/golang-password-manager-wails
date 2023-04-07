


const ErrorToast =({description, message}:{description: string,message:any}) => {
    return (
        <div className="rnc__base">
        <div className="rnc__notification-container--top-right">
            <div className="rnc__notification" style={{height: "83px",width: "325px", transition: "height 10ms ease 0s"}}>
                <div className="animate__animated animate__fadeIn rnc__notification-item rnc__notification-item--danger">
                    <div className="rnc__notification-content">
                        <div className="rnc__notification-close-mark"></div>
                        <div className="rnc__notification-title">{description}</div>
                        <div className="rnc__notification-message">{message}</div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
    )
}

export default ErrorToast