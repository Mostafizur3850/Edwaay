const fs = require('fs');
let content = fs.readFileSync('src/modules/jobs/CVBuilder.tsx', 'utf8');

// Replace common hardcoded dark theme classes with dark/light mode responsive classes

content = content.replace(
    /const InputWithIcon = \(\{\s*label,\s*icon:\s*Icon,\s*value,\s*onChange,\s*placeholder\s*\}\:\s*any\)\s*=>\s*\(\s*<div className="space-y-1.5">\s*<label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">/g,
    `const InputWithIcon = ({ label, icon: Icon, value, onChange, placeholder }: any) => (
    <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">`
);

content = content.replace(
    /pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors/g,
    `pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors`
);

content = content.replace(
    /className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all shadow-sm hover:border-slate-600"/g,
    `className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all shadow-sm hover:border-slate-300 dark:hover:border-slate-600"`
);

content = content.replace(
    /className="min-h-screen bg-\[#0B0F19\] text-white font-sans flex flex-col lg:flex-row"/g,
    `className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white font-sans flex flex-col lg:flex-row"`
);

content = content.replace(
    /className="w-full lg:w-1\/3 bg-\[#151921\] border-r border-white\/5 h-screen overflow-y-auto custom-scrollbar p-6 print:hidden flex flex-col"/g,
    `className="w-full lg:w-1/3 bg-white dark:bg-[#151921] border-r border-slate-200 dark:border-white/5 h-screen overflow-y-auto custom-scrollbar p-6 print:hidden flex flex-col"`
);

content = content.replace(
    /<h2 className="text-2xl font-bold flex items-center gap-2">/g,
    `<h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">`
);

content = content.replace(
    /<PenTool className="text-cyan-400" \/> CV Builder/g,
    `<PenTool className="text-cyan-500 dark:text-cyan-400" /> CV Builder`
);

content = content.replace(
    /<button onClick=\{\(\) => window.history.back\(\)\} className="text-sm text-slate-400 hover:text-white">Exit<\/button>/g,
    `<button onClick={() => window.history.back()} className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Exit</button>`
);

content = content.replace(
    /<label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Choose Template<\/label>/g,
    `<label className="text-xs font-bold text-slate-600 dark:text-slate-500 uppercase tracking-wider mb-3 block">Choose Template</label>`
);

content = content.replace(
    /className=\{\`p-2 rounded-lg border text-xs font-medium transition-all \$\{selectedTemplate === t.id \? 'border-cyan-500 bg-cyan-500\/10 text-cyan-400' : 'border-slate-700 text-slate-400 hover:border-slate-500'\}\`\}/g,
    `className={\`p-2 rounded-lg border text-xs font-medium transition-all \${selectedTemplate === t.id ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'}\`}`
);

content = content.replace(
    /<div className="flex gap-1 bg-slate-800 p-1 rounded-lg mb-6 overflow-x-auto">/g,
    `<div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-6 overflow-x-auto">`
);

content = content.replace(
    /className=\{\`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors capitalize \$\{activeTab === tab \? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'\}\`\}/g,
    `className={\`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors capitalize \${activeTab === tab ? 'bg-white dark:bg-cyan-600 text-cyan-700 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}\`}`
);

// Sections background and borders
content = content.replace(
    /className="bg-slate-800\/30 p-5 rounded-2xl border border-slate-700\/50 space-y-4"/g,
    `className="bg-slate-50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 space-y-4"`
);

content = content.replace(
    /<div className="p-1.5 bg-cyan-500\/20 rounded-lg text-cyan-400">/g,
    `<div className="p-1.5 bg-cyan-100 dark:bg-cyan-500/20 rounded-lg text-cyan-600 dark:text-cyan-400">`
);

content = content.replace(
    /<h3 className="font-bold text-slate-200 text-sm">Identity Details<\/h3>/g,
    `<h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Identity Details</h3>`
);

content = content.replace(
    /<div className="p-1.5 bg-emerald-500\/20 rounded-lg text-emerald-400">/g,
    `<div className="p-1.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400">`
);
content = content.replace(
    /<h3 className="font-bold text-slate-200 text-sm">Contact Information<\/h3>/g,
    `<h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Contact Information</h3>`
);

content = content.replace(
    /<div className="p-1.5 bg-blue-500\/20 rounded-lg text-blue-400">/g,
    `<div className="p-1.5 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">`
);
content = content.replace(
    /<h3 className="font-bold text-slate-200 text-sm">Social Links<\/h3>/g,
    `<h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Social Links</h3>`
);

content = content.replace(
    /className="bg-gradient-to-br from-purple-900\/10 to-slate-800\/30 p-5 rounded-2xl border border-purple-500\/20 relative group"/g,
    `className="bg-gradient-to-br from-purple-50 to-slate-50 dark:from-purple-900/10 dark:to-slate-800/30 p-5 rounded-2xl border border-purple-200 dark:border-purple-500/20 relative group"`
);
content = content.replace(
    /<div className="p-1.5 bg-purple-500\/20 rounded-lg text-purple-400">/g,
    `<div className="p-1.5 bg-purple-100 dark:bg-purple-500/20 rounded-lg text-purple-600 dark:text-purple-400">`
);
content = content.replace(
    /<h3 className="font-bold text-slate-200 text-sm">Professional Summary<\/h3>/g,
    `<h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Professional Summary</h3>`
);

content = content.replace(
    /className="w-full bg-slate-900\/80 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:border-purple-400 focus:ring-1 focus:ring-purple-400\/50 outline-none leading-relaxed resize-none transition-all"/g,
    `className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 outline-none leading-relaxed resize-none transition-all"`
);

content = content.replace(
    /className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative group"/g,
    `className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 relative group"`
);
content = content.replace(
    /className="absolute top-2 right-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"/g,
    `className="absolute top-2 right-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"`
);

content = content.replace(
    /className="bg-slate-800 p-5 rounded-xl border border-slate-700 relative group"/g,
    `className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 relative group"`
);
content = content.replace(
    /className="absolute top-3 right-3 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"/g,
    `className="absolute top-3 right-3 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"`
);

content = content.replace(
    /className="w-full py-3 border border-dashed border-slate-600 rounded-xl text-slate-400 hover:border-cyan-500 hover:text-cyan-400 hover:bg-slate-800\/50 flex items-center justify-center gap-2 text-sm font-medium transition-all"/g,
    `className="w-full py-3 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 hover:border-cyan-500 dark:hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center justify-center gap-2 text-sm font-medium transition-all"`
);

content = content.replace(
    /<label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block ml-1">Description<\/label>/g,
    `<label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block ml-1">Description</label>`
);

content = content.replace(
    /className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-cyan-500 outline-none pr-10 resize-none"/g,
    `className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-cyan-500 outline-none pr-10 resize-none"`
);

content = content.replace(
    /className="absolute bottom-3 right-3 text-purple-400 hover:text-purple-300 p-1.5 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-purple-500\/20"/g,
    `className="absolute bottom-3 right-3 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-purple-200 dark:border-purple-500/20"`
);

content = content.replace(
    /className="bg-slate-800\/30 p-5 rounded-2xl border border-slate-700\/50"/g,
    `className="bg-slate-50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50"`
);

content = content.replace(
    /<label className="text-sm font-bold text-slate-200 mb-3 block flex items-center gap-2">/g,
    `<label className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 block flex items-center gap-2">`
);

content = content.replace(
    /<Code size=\{16\} className="text-cyan-400" \/> Technical Skills/g,
    `<Code size={16} className="text-cyan-600 dark:text-cyan-400" /> Technical Skills`
);

content = content.replace(
    /className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-white placeholder-slate-600 focus:border-cyan-500 outline-none"/g,
    `className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-cyan-500 outline-none"`
);

content = content.replace(
    /<h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Preview<\/h4>/g,
    `<h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Preview</h4>`
);

content = content.replace(
    /className="px-3 py-1.5 bg-cyan-900\/20 text-cyan-400 text-xs font-bold rounded-lg border border-cyan-500\/20 flex items-center gap-1"/g,
    `className="px-3 py-1.5 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 text-xs font-bold rounded-lg border border-cyan-200 dark:border-cyan-500/20 flex items-center gap-1"`
);

content = content.replace(
    /<div className="w-1.5 h-1.5 rounded-full bg-cyan-400" \/>/g,
    `<div className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400" />`
);

content = content.replace(
    /<span className="text-slate-600 text-sm italic">No skills added yet.<\/span>/g,
    `<span className="text-slate-500 dark:text-slate-600 text-sm italic">No skills added yet.</span>`
);

content = content.replace(
    /className="w-full lg:w-2\/3 bg-slate-900 p-8 flex flex-col items-center justify-center relative print:w-full print:p-0 print:absolute print:top-0 print:left-0 print:bg-white print:text-black"/g,
    `className="w-full lg:w-2/3 bg-slate-100 dark:bg-slate-900 p-8 flex flex-col items-center justify-center relative print:w-full print:p-0 print:absolute print:top-0 print:left-0 print:bg-white print:text-black"`
);

fs.writeFileSync('src/modules/jobs/CVBuilder.tsx', content);
