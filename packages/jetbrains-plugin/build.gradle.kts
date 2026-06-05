plugins {
    id("org.jetbrains.intellij.platform") version "2.1.0"
    kotlin("jvm") version "1.9.25"
}

group = "dev.diotto"
version = "1.0.0"

repositories {
    mavenCentral()
    intellijPlatform { defaultRepositories() }
}

dependencies {
    intellijPlatform {
        intellijIdeaCommunity("2024.1")
        instrumentationTools()
    }
}

intellijPlatform {
    pluginConfiguration {
        name = "Runic Skills"
        version = "1.0.0"
        description = "91 AI & Dev skills — code review, debug, tests, LLM cost, security and more."
        changeNotes = "Initial release."

        ideaVersion {
            sinceBuild = "241"
            untilBuild = provider { null }
        }
    }

    signing {
        certificateChain = System.getenv("CERTIFICATE_CHAIN")
        privateKey = System.getenv("PRIVATE_KEY")
        password = System.getenv("PRIVATE_KEY_PASSWORD")
    }

    publishing {
        token = System.getenv("PUBLISH_TOKEN")
    }
}
