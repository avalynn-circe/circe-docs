---
slug: /white-papers/config-binds-at-pod-start
sidebar_label: "Config binds at pod start"
sidebar_position: 4
description: "A team rule, a case that contradicts it, and the check that works either way: read what the serving pod used."
---

# Config binds at pod start, not at deploy

What the records show, where they disagree, and the check that works either way.

By Avalynn Circe, Botco CX. Written 2026-11-10 from session records and log excerpts quoted in them.
Client names are changed. Bot, deployment, pod and user ids are removed. Dates, times and ticket ids are real. Log queries were not run again for this paper.

## The problem in two sentences

- A test can run on a pod that still has the old bot config. A wrong conclusion follows, in either direction.
- The team rule says config binds when a pod starts. One case shows a running pod receiving new config with no restart, so the rule is not settled.

## The rule as written

> Bot card config binds when a pod starts, not when a deploy is recorded. After a deploy, confirm which pod served a test before trusting the result.

It was written on 2026-09-13. The likely source is the case in the next section. That link is inferred from timing.

## Evidence for the rule

Client C, 2026-09-08 (seen in logs):

- The last deploy was 2026-08-12. Prompt edits were made on 2026-09-05.
- The old pod last used the old wording at 20:35 on 2026-09-08.
- A new pod started at 21:25, 50 minutes later. It served the 2026-09-05 edits.

## Evidence against the rule

Client B, ticket CX-2867, 2026-09-11 (seen in logs):

| Time (UTC) | Pod | Event |
|---|---|---|
| 14:52:51 | Pod 1 | Starts |
| 15:59:25 | Pod 2 | Starts (second deploy) |
| 16:03:53 | Pod 1 | Prompt sent without the fix |
| 16:32:14 | Pod 1 | Prompt sent with the fix |

- Both prompt lines are in the log of the same container. It was not a restart.
- The conclusion "the deploy did not take" was written after 16:03. It was withdrawn at 16:43: "My claim that config is baked at deploy time and a running pod cannot change was wrong."
- The memory note from that session: "Do not assume 'the pod predates my save, therefore my change is not live'."

## What we can say

- Both facts can be true. A pod may receive config after a delay. A restart also picks it up. This is inferred.
- The mechanism was not found. No session tested the delay on purpose.
- Why Pod 1 changed 30 minutes or more after the deploy is not known.

So do not decide from the age of a pod, in either direction. Read what the pod actually used.

## Cases where the serving pod decided the result

| Case and date | What happened | Result |
|---|---|---|
| Client B, CX-2867, 2026-09-11 03:28 | Test on a pod that showed the old classifier prompt. Edits were saved before the deploy finished building. | Right to doubt the fix. The cause "deploy raced my saves" is inferred. |
| Client B, CX-2867, 2026-09-11 17:07 | A pod started at 16:46:49. It was called a finished deploy. The Deployments page still said "Deploying". | Wrong. Withdrawn at 17:12: "treating a pod's existence as evidence about deploy state." |
| Client D, 2026-10-01 | Deploy record changed at 17:38. The old pod was the only one logging. New pod online at 18:10:38. Early form steps ran on the old pod, until 18:12:51. The coverage question ran on the new pod at 18:15:36. | Both fix routes passed on the new pod. |
| Client E, CX-3048, 2026-10-20 | Redeploy 08:37. New pod started about 09:00. All 6 runs hit the new pod. | Over-65 routing worked in 3 of 3 runs. That the new pod had the edit is inferred from its start time. It was not read from the logs. |
| Client E, CX-3049, 2026-11-05 | Three pods in about 40 minutes (tags 58, 59, 60). A run on tag 59 showed no button. The button had been saved after that run. | Expected result. On tag 60: 3 of 3 runs had the button, then 14 of 15 free-text runs. One weather run had none, not explained. |
| Client F, CX-3092, 2026-10-19 | Run 1 ran on the old pod. A new pod was starting. | Run 1 excluded. Testing began when only the new pod was ready. 3 of 3 runs passed. |
| Client R3, pilot, 2026-10-22 | An old pod was still logging after redeploy. | Tests used only the new pod. User note: it can lag behind the deployment completion. |
| Client I, CX-3012, 2026-10-05 | 7 of 7 tests passed. The pod was not checked. | The result carries no pod evidence. |

## How to confirm the serving pod

Log datasource: Loki. Always set the namespace to production. The same app label also ran in the staging cluster.

- Pod start times: `{namespace="chatbot-prod", app="wb-<agent>-dpl-<deploy>"} |= "Starting service [Catalina]"`
- Serving pod: read the `pod` label on the log line of the turn. Find the turn by the user id. "Clear chat" gives a new user id.
- What the pod actually sent: search the logs for `requestInstastack`. Check a known string from your edit.
- Pod start in metrics: `kube_pod_start_time{namespace="chatbot-prod", pod=~"wb-<agent>-dpl-<deploy>-.*"}`
- Pod names end in `<ReplicaSetHash>-<suffix>`. A new hash means a new template, so a deploy. The same hash with the log file changing from `0.log` to `1.log` is a container restart.
- The deploy record in the MCP tool can lag. On 2026-11-05 it still showed the 2026-10-27 tag while a newer pod existed.
- A pod that exists is not a finished deploy. Wait until the Deployments page shows Online and the old pod has stopped.

## Practice for every test

1. Record the pod name and its start time.
2. Check that the pod used your change, in the logged prompt or config.
3. Do not count a run on an old pod.
4. Say which of the three you checked and which you inferred.

## Not known

- How a running pod receives new config, and how long it takes.
- Whether edits saved after a pod started reach that pod without a deploy. The two cases above point in different directions.
- Why two containers restarted about 18 minutes after a pod start (noted in the CX-2867 session, not explained).
- Whether the Deployments page and the MCP deploy dates match real pod start times. They differed in CX-3049.

## Sources

- Rule text and the memory note of 2026-09-11 about CX-2867. The two disagree, and no file says which one is final.
- Sessions for CX-2867, CX-2714, CX-3048, CX-3049, CX-3092, CX-3012, the 2026-10-22 migration pilot, and a 2026-09-12 investigation for Client C.
