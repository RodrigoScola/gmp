export const Tooltip = (props) => {
    return (<div {...props} className="sidebar-icon group">
      {props.children}
      <span className="sidebar-tooltip group-hover:scale-100">
        {props.text}
      </span>
    </div>);
};
