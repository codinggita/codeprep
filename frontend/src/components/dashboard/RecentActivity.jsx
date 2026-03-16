function RecentActivity({ problems }) {

  return (

    <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6">

      <h2 className="text-white text-lg font-semibold mb-4">
        Recent Activity
      </h2>

      <div className="flex flex-col gap-3">

        {problems.map((problem, index) => (

          <div
            key={index}
            className="flex justify-between items-center p-3 rounded-lg bg-[#020617] border border-white/5"
          >

            <span className="text-gray-300">
              {problem.title}
            </span>

            <span className="text-sm text-green-400">
              Solved
            </span>

          </div>

        ))}

      </div>

    </div>

  );

}

export default RecentActivity;