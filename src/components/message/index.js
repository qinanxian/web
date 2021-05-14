import { message } from 'antd';

// export default class Message extends React.Component{
//     message: Antd.message
// }

export const success = (content, duration, onClose) => {
    message.success(content, duration, onClose);
};
export const error = (content, duration, onClose) => {
    message.error(content, duration, onClose);
};
export const info = (content, duration, onClose) => {
    message.info(content, duration, onClose);
};
export const warning = (content, duration, onClose) => {
    message.warning(content, duration, onClose);
};
export const warn = (content, duration, onClose) => {
    message.warn(content, duration, onClose);
};
export const loading = (content, duration, onClose) => {
    message.loading(content, duration, onClose);
};
export const config = (options) => {
    message.config(options);
};
export const destroy = () => {
    message.destroy();
};

