/**
 * Temporary Debug Panel - Shows React Flow state and localStorage
 * 
 * Import and add to canvas page.js:
 * import DebugPanel from './DebugPanel'
 * 
 * Then add in JSX: <DebugPanel nodes={nodes} edges={edges} />
 */

'use client'
import { useState } from 'react'

export default function DebugPanel({ nodes, edges }) {
  const [isOpen, setIsOpen] = useState(false)

  const clearAll = () => {
    if (confirm('Clear all canvas data? This will refresh the page.')) {
      localStorage.removeItem('nodes')
      localStorage.removeItem('edges')
      window.location.reload()
    }
  }

  const checkLocalStorage = () => {
    const storedNodes = localStorage.getItem('nodes')
    const storedEdges = localStorage.getItem('edges')
    
    console.log('=== LOCALSTORAGE CHECK ===')
    console.log('Stored Nodes:', storedNodes ? JSON.parse(storedNodes) : 'None')
    console.log('Stored Edges:', storedEdges ? JSON.parse(storedEdges) : 'None')
    console.log('=========================')
    alert('Check console for localStorage data')
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700 z-50"
      >
        🐛 Debug
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-gray-300 rounded-lg shadow-xl p-4 z-50 max-w-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">Debug Panel</h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {/* Current State */}
        <div className="bg-gray-50 p-3 rounded">
          <h4 className="font-semibold text-sm mb-2">React Flow State</h4>
          <p className="text-sm">Nodes: <strong>{nodes.length}</strong></p>
          <p className="text-sm">Edges: <strong>{edges.length}</strong></p>
          
          {nodes.length > 0 && (
            <div className="mt-2 space-y-1">
              {nodes.map(node => (
                <div key={node.id} className="text-xs bg-white p-1 rounded border">
                  <span className="font-mono">{node.type || 'unknown'}</span>
                  {node.data?.tableName && (
                    <span className="text-red-600 ml-2">
                      🔴 DynamoDB: {node.data.tableName}
                    </span>
                  )}
                  {node.data?.bucketName && (
                    <span className="text-blue-600 ml-2">
                      S3: {node.data.bucketName}
                    </span>
                  )}
                  {node.data?.name && (
                    <span className="text-green-600 ml-2">
                      EC2: {node.data.name}
                    </span>
                  )}
                  {node.data?.dbName && (
                    <span className="text-purple-600 ml-2">
                      RDS: {node.data.dbName}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={checkLocalStorage}
            className="w-full bg-yellow-500 text-white px-3 py-2 rounded text-sm hover:bg-yellow-600"
          >
            Check localStorage (see console)
          </button>
          
          <button
            onClick={clearAll}
            className="w-full bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
          >
            ⚠️ Clear All & Refresh
          </button>
        </div>

        {/* Warning if ghost data detected */}
        {nodes.length > 0 && (
          <div className="bg-red-50 border border-red-300 rounded p-2">
            <p className="text-xs text-red-800">
              ⚠️ <strong>Canvas has {nodes.length} nodes</strong> but appears empty? 
              Old data might be in localStorage!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
