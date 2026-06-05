package dev.diotto.runic

import com.intellij.notification.NotificationGroupManager
import com.intellij.notification.NotificationType
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.project.Project
import java.io.File

class ConfigureMcpAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        configureMcp(project)
    }

    companion object {
        fun configureMcp(project: Project) {
            val configDir = File(System.getProperty("user.home"), ".config/JetBrains")
            configDir.mkdirs()
            val mcpFile = File(configDir, "mcp.json")

            val config = """
                {
                  "servers": {
                    "runic": {
                      "command": "npx",
                      "args": ["-y", "@diottodev/runic"]
                    }
                  }
                }
            """.trimIndent()

            if (!mcpFile.exists()) {
                mcpFile.writeText(config)
                notify(project, "Runic MCP server configured. Restart your IDE to activate.")
            } else {
                notify(project, "MCP config already exists at ${mcpFile.path}. Add 'runic' to your servers if not present.")
            }
        }

        private fun notify(project: Project, message: String) {
            NotificationGroupManager.getInstance()
                .getNotificationGroup("Runic")
                .createNotification("Runic Skills", message, NotificationType.INFORMATION)
                .notify(project)
        }
    }
}
