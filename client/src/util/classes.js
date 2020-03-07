import classNames from 'classnames';

export default function classes() {
    return {className: classNames(...arguments)};
}
