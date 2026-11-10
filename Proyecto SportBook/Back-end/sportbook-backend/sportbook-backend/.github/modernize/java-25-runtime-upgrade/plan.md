# Modernization Plan: Java 25 Runtime Upgrade

**Project**: SportBook

## Technical Framework

- **Language**: Java 17 (assessment and project documentation)
- **Framework**: Spring Boot 3.2.5
- **Build Tool**: Maven
- **Database**: PostgreSQL
- **Key Dependencies**: Spring Web, Spring Data JPA, Spring Security, JJWT,
  Springdoc OpenAPI
- **CI**: No GitHub Actions workflow files were found in the repository.

## Overview

Upgrade the SportBook backend from Java 17 to Java 25 while preserving existing
application and API behavior. Align Maven's Java version and any explicit
compiler level settings, and make only the framework/dependency compatibility
changes required to build and test on Java 25. Update the repository's runtime
version documentation and any applicable CI Java setup.

The existing Spring Boot 3.2.5 baseline is not compatible with Java 25 according
to the Java upgrade compatibility guidance (Spring Boot 4.x / Spring Framework
7.x is the compatible line). Upgrade that framework layer and any strictly
coupled dependencies or APIs only as needed for Java 25 compatibility.

## Migration Impact Summary

| Application | Original Runtime | Target Runtime | Azure Service | Comments |
|-------------|------------------|----------------|---------------|----------|
| SportBook backend | Java 17 | Java 25 | None | Runtime/framework compatibility only |

This is a code and toolchain upgrade; no Azure service migration, deployment, or
application launch is included.

## Scope and Verification

- Address the assessment's Java version finding
  (`azure-java-version-02000`, `pom.xml:21`); exclude unrelated cloud-readiness
  assessment findings.
- Set Maven's `java.version` to 25 and align any explicit compiler
  `source`, `target`, or `release` values. Confirm the effective Maven compiler
  configuration rather than adding redundant settings.
- Upgrade Spring Boot/Spring Framework and directly coupled dependencies or
  source APIs only when required for Java 25 compatibility. Preserve runtime,
  API, and business behavior.
- Update Java and framework version references in the repository root
  `README.md`. No project-local README or additional documentation files were
  found during planning.
- Recheck CI Java setup during implementation; no workflow files currently
  exist to update.
- Verify with a Java 25 Maven build and the existing unit tests (for example,
  `mvn -B clean verify`). Do not start or launch the application.

## Open Questions & Questionnaire

No open questions. The requested scope authorizes framework compatibility
changes only where necessary for Java 25.
