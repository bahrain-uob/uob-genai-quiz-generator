interface TitlesProps {
  title: String[];
}

function Titles(props: TitlesProps) {
  return (
    <>
      {props.title.length == 1 ? (
        <div className="title">
          <p>{props.title[0]}</p>
        </div>
      ) : (
        <>
          <div className="course-title">
            <p>{props.title[0]}</p>
          </div>
          <div className="course-content">
            <p>{props.title[1]}</p>
          </div>
        </>
      )}
    </>
  );
}

export default Titles;
