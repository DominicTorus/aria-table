export const RenderTooltip = ({ tooltip }) => {
  return (
    <div>
      {tooltip &&
        Object.keys(tooltip).length > 0 &&
        Object.keys(tooltip)?.map((key) => {
          return (
            <div>
              <div>{key}:</div>
              <div>{tooltip[key]}</div>
            </div>
          );
        })}
    </div>
  );
};
