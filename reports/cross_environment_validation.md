# Cross-Environment Validation

## Objective
Test whether the patterns learned by the current models generalize under a shifted data distribution.

## Environment Definition
Proxy environments were defined by running stratified k-means clustering with 3 clusters on standardized descriptor vectors, preserving both classes across the held-out environments.

## Validation Setup
- Leave-one-environment-out evaluation
- Train on two clusters, test on the held-out cluster
- Models: Logistic Regression, Random Forest, feedforward neural network, descriptor-graph prototype

## Mean Performance Across Held-Out Environments

| model_name | accuracy | f1_score | roc_auc | rb_recall |
| --- | --- | --- | --- | --- |
| descriptor_graph_neural_network_prototype | 0.3688 | 0.0493 | 0.7181 | 0.2484 |
| feedforward_neural_network | 0.3532 | 0.0610 | 0.6108 | 0.3072 |
| logistic_regression | 0.3727 | 0.0754 | 0.6592 | 0.3143 |
| random_forest_classifier | 0.4210 | 0.2250 | 0.5805 | 0.4284 |

## RB Recall Stability

| model_name | min | max | mean |
| --- | --- | --- | --- |
| descriptor_graph_neural_network_prototype | 0.0000 | 0.7451 | 0.2484 |
| feedforward_neural_network | 0.0000 | 0.9216 | 0.3072 |
| logistic_regression | 0.0000 | 0.9216 | 0.3143 |
| random_forest_classifier | 0.0000 | 0.9216 | 0.4284 |

## Charts
- figures/cross_environment/mean_scores.png
![mean_scores](figures/cross_environment/mean_scores.png)

- figures/cross_environment/rb_recall_heatmap.png
![rb_recall_heatmap](figures/cross_environment/rb_recall_heatmap.png)


## Interpretation
These results show how performance changes when models are tested outside the descriptor region they were trained on. The most important signal is whether RB recall collapses under distribution shift.
