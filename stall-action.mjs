import { Octokit } from "@octokit/rest";
import { throttling } from "@octokit/plugin-throttling";
import { retry } from "@octokit/plugin-retry";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
class NewOctokit extends Octokit.plugin(throttling, retry) {
    constructor() {
        super({
            auth: GITHUB_TOKEN,
            throttle: {
                onRateLimit: () => true,
                onSecondaryRateLimit: () => true,
            }
        });
    }
}
const targets = ['AnnAngela/annangela.cn-monitor']//process.env.TARGETS.split(/\s,\s/);
const date = new Date(Date.now() - 30 * 60 * 1000);
console.info("Date:", new Intl.DateTimeFormat("zh-CN", {
    hour12: false,
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
}).format(date));
const datetimeCondition = `<${date.toISOString()}`;
for (const target of targets) {
    const [owner, repo] = target.split("/");
    const octokit = new NewOctokit();
    for (const status of ["in_progress"]) {
        const workflows = await octokit.paginate(octokit.rest.actions.listWorkflowRunsForRepo, {
            per_page: 100,
            owner, repo,
            status,
            created: datetimeCondition,
        });
        console.info(status, workflows);
        for (const a of workflows) {
            console.info(a.id, a.status, a.created_at, a.updated_at);
            await octokit.rest.actions.cancelWorkflowRun({
                owner, repo,
                run_id: a.id,
            });
        }
    }
}
