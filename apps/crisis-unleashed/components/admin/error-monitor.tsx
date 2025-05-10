"use client"

import { useState, useEffect } from "react"
import { getErrorLogs, clearErrorLogs } from "@/lib/error-logger"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Trash2, RefreshCw } from "lucide-react"

/**
 * Displays and manages error logs with filtering, refreshing, and clearing capabilities.
 *
 * Renders a tabbed interface for viewing error logs by severity, with options to refresh or clear logs. Each log entry displays details such as component name, timestamp, message, optional URL, and expandable stack trace.
 */
export function ErrorMonitor() {
  const [logs, setLogs] = useState<ReturnType<typeof getErrorLogs>>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = () => {
    setLogs(getErrorLogs())
  }

  const handleClearLogs = () => {
    clearErrorLogs()
    setLogs([])
  }

  const filteredLogs = logs.filter((log) => {
    if (activeTab === "all") return true
    return log.severity === activeTab
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <AlertTriangle className="h-6 w-6 mr-2 text-amber-500" />
          Error Monitor
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={loadLogs}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="destructive" size="sm" onClick={handleClearLogs}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Logs
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Errors</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
          <TabsTrigger value="high">High</TabsTrigger>
          <TabsTrigger value="medium">Medium</TabsTrigger>
          <TabsTrigger value="low">Low</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No error logs to display</div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    log.severity === "critical"
                      ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                      : log.severity === "high"
                        ? "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800"
                        : log.severity === "medium"
                          ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                          : "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{log.componentName || "Unknown Component"}</span>
                    <span className="text-sm text-gray-500">{new Date(log.timestamp || "").toLocaleString()}</span>
                  </div>
                  <p className="mt-2 font-mono text-sm">{log.message}</p>
                  {log.url && <p className="mt-1 text-xs text-gray-500">URL: {log.url}</p>}
                  {log.stack && (
                    <details className="mt-2">
                      <summary className="text-sm cursor-pointer">Stack Trace</summary>
                      <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-auto max-h-40">
                        {log.stack}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
