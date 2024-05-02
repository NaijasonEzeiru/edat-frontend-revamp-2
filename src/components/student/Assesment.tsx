const Assesment = () => {
  const learningOutcomes = [
    {
      question: "Solving simple linear equations with one unknown on one side",
      score: "1",
      mark: "1",
    },
    {
      question: "Solving linear equations with unknowns on both sides",
      score: "2",
      mark: "2",
    },
    {
      question:
        "Understanding and setting up linear equations to represent real world problems",
      score: "1",
      mark: "2",
    },
    {
      question: "Solving linear equations with unknown on both sides",
      score: "1",
      mark: "3",
    },
    {
      question: "Setting up and solving linear equations in real-world context",
      score: "2",
      mark: "3",
    },
  ];

  return (
    <div className="mx-3 md:mx-24 my-9">
      <h1 className="text-3xl font-medium text-center mb-12">
        Assesment Feedback
      </h1>
      <div className="flex gap-2">
        <p className="font-semibold">Candidate's Name:</p>
        <p>John Doe</p>
      </div>
      <div className="flex gap-2  mb-12">
        <p className="font-semibold">Overall Mark</p>
        <p>6/10</p>
      </div>
      <h5 className="font-semibold">Learning Outcome Performance:</h5>
      <div className="space-y-3">
        {learningOutcomes.map((value, index) => {
          const percent = Math.round((+value.score / +value.mark) * 100);
          let color: string;
          if (percent < 40) {
            color = "red";
          } else if (percent > 40 && percent < 70) {
            color = "#ffd605";
          } else {
            color = "green";
          }
          return (
            <div key={index} className="flex items-center justify-between">
              <p>
                {value.question} (Q{index + 1}): {value.score}/{value.mark}
              </p>
              <div className="flex gap-2 w-40 justify-start">
                <div className="h-8 w-20 relative bg-slate-300 rounded-sm">
                  <div
                    className={`absolute left-0 top-0 h-8 rounded-sm`}
                    style={{
                      width: `${percent}%`,
                      backgroundColor: color,
                    }}
                  ></div>
                </div>
                <p>({percent}%)</p>
              </div>
            </div>
          );
        })}
      </div>
      <h4 className="mt-8 text-xl font-semibold mb-2">Examiner Feedback:</h4>
      <p>
        John demostrates a good understanding of solving linear equations with
        one unknown on one side and with unknowns on both sides (Questions 1, 2
        and partially in 4). in Question 3, John was able to set up the equation
        representing the relationship between fruits sold but missed mentioning
        the total income. It is recommended to that John practices showing all
        steps involved in solving equations (subtracting 2x in Q4). in Question
        5, John established a correct equation solving but could benefit from
        explaining how tghe decimal answer relates to the real-world scenario
        (rounding up to whole washes).
      </p>
      <div>
        <p>
          <span className="font-semibold pr-2">Overall:</span> John's perfomance
          shows a good grasp of basic linear equations. With little more
          practice on complete solution processes and real-world application
          interpretation, John can improve his score significantly.
        </p>
      </div>
    </div>
  );
};

export default Assesment;
