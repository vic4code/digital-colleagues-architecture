# Voyager implementation review

Pinned revision: `55e45a880755d0c8c66ca7fb5fe7962ac8974f89`.

[learn()](https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/voyager/voyager.py#L295) calls the curriculum to propose a task, runs a rollout, stores a skill on success, and updates exploration progress before selecting another task. This is direct evidence of an outer task-selection loop under an assigned exploration objective.

[propose_next_task()](https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/voyager/agents/curriculum.py#L240) contains a fixed initial wood-log task and an inventory-dependent branch, with model generation on the normal path. Task selection is therefore a combination of program branches and model judgment.

[step()](https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/voyager/voyager.py#L203) invokes the action model, executes environment actions, and uses observations and critic feedback to revise execution. [The critic](https://github.com/MineDojo/Voyager/blob/55e45a880755d0c8c66ca7fb5fe7962ac8974f89/voyager/agents/critic.py#L91) parses a model success judgment. This is not a deterministic proof of success.

Novelty and difficulty instructions guide curriculum generation. The inspected path does not implement a scalar information-gain optimizer or demonstrate human-like intrinsic motivation. Interpretation: Voyager delegates selecting the next bounded task, beyond merely continuing the same task.

Six isolated checks exercised original class bodies with mocked collaborators: initial task, inventory branch, valid and invalid task parsing, and success/failure skill-persistence branches. No model calls, Minecraft session, or full upstream test suite were executed.
