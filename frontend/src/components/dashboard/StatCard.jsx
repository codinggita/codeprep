function StatCard({ title, value }) {

  return (

    <div className="bg-[#0f172a] border border-white/10 rounded-xl p-5 flex flex-col gap-2">

      <p className="text-gray-400 text-sm">
        {title}
      </p>

      <h2 className="text-2xl font-bold text-white">
        {value}
      </h2>

    </div>

  );

}

export default StatCard;