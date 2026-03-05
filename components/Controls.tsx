/**
 * Controls Component
 * 
 * US-008: Displays keyboard controls
 */

/**
 * Controls component - shows keyboard shortcuts
 */
export function Controls() {
  const controlGroups = [
    {
      title: 'Movement',
      controls: [
        { key: '← →', action: 'Move' },
        { key: '↓', action: 'Soft Drop' },
        { key: 'Space', action: 'Hard Drop' },
      ],
    },
    {
      title: 'Rotation',
      controls: [
        { key: '↑ / X', action: 'Rotate CW' },
        { key: 'Z', action: 'Rotate CCW' },
      ],
    },
    {
      title: 'Actions',
      controls: [
        { key: 'C', action: 'Hold Piece' },
        { key: 'P / Esc', action: 'Pause' },
      ],
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-blue-400 font-bold text-sm mb-2 uppercase tracking-wider">Controls</h3>
      
      <div className="w-40 bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 space-y-4">
        {controlGroups.map((group) => (
          <div key={group.title}>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">{group.title}</p>
            <div className="space-y-1">
              {group.controls.map(({ key, action }) => (
                <div key={action} className="flex justify-between items-center text-sm">
                  <kbd className="px-2 py-0.5 bg-slate-800 rounded text-slate-300 font-mono text-xs">
                    {key}
                  </kbd>
                  <span className="text-slate-400 text-xs">{action}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Controls;
