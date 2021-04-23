import '../styles/modal.css';

export default function Modal({ title, children }: any) {
    return(
        <div className='modal-contain'>
            <div className='modal-body'>
                <h2>{title}</h2>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}