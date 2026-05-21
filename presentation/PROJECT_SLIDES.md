# Predicting Plastic Degradation with Machine Learning

Student: Aryamann Zutshi  
Course: EECS 692  
Instructor: Dr. David Johnson

---

## Slide 1: Title

**Title:** Predicting Plastic Degradation with Machine Learning  
**Subtitle:** From descriptor baselines to reliability-aware model selection

**What to say:**
This project started as a machine learning study of biodegradability prediction and gradually became a reliability study. Instead of stopping at performance, I kept pushing the project toward a more research-level question: not just which model predicts best, but which model is actually trustworthy when the data distribution changes.

---

## Slide 2: Project Objective

**Slide bullets:**
- Predict biodegradability from molecular descriptor data
- Compare classical ML, neural networks, and graph-inspired methods
- Improve the pipeline through validation, feature engineering, and uncertainty analysis
- Select a final model based on reliability, not just accuracy

**What to say:**
The overall goal was to use machine learning to predict biodegradability, but the project evolved over time. Early on, the focus was on prediction performance. By the end, the more important question became whether the model could be trusted, especially under shifted conditions. That shift in focus shaped the later weeks of the project.

---

## Slide 3: Dataset and Representation

**Slide bullets:**
- Dataset: QSAR biodegradation dataset
- 1,055 samples
- 41 molecular descriptors
- Binary target: `RB` vs `NRB`
- Descriptor examples:
  - `SpMax_L`
  - `SpMax_B_m`
  - `SM6_B_m`
  - `nN`
  - `LOC`

**What to say:**
The dataset I used was a QSAR biodegradation dataset with 1,055 compounds, 41 molecular descriptors, and a binary class label: readily biodegradable or not readily biodegradable. One important limitation is that this is not a polymer graph dataset and it does not contain true degradation-rate constants, so I had to adapt later project stages to fit the data that was actually available.

---

## Slide 4: Project Progression

**Slide bullets:**
- Baseline classification models
- Feedforward neural network
- Descriptor-graph prototype
- Cross-environment validation
- Stratified validation and class-imbalance handling
- Chemistry-aware proxy feature engineering
- Feature importance and feature selection
- Uncertainty and calibration
- Final model reliability selection

**What to say:**
The project was very iterative. I did not just build one model and stop. Each week answered a new question. First I established baselines, then tested a neural network, then tried a graph-inspired prototype, then stress-tested generalization, then improved the pipeline, engineered new features, studied which features mattered, and finally focused on uncertainty and final model selection.

---

## Slide 5: Baseline Modeling Results

**Slide bullets:**
- Logistic Regression
  - accuracy: `0.8626`
  - ROC-AUC: `0.9136`
- Random Forest
  - accuracy: `0.8768`
  - ROC-AUC: `0.9423`
- Random Forest was the strongest early baseline

**What to say:**
The first strong result was that Random Forest outperformed Logistic Regression on the standard split. That gave me a solid baseline and established that the descriptor set already carried a strong signal for biodegradability classification. At this stage, Random Forest looked like the best choice, but this was still only a standard split result.

---

## Slide 6: Neural Network and GNN Prototype

**Slide bullets:**
- Feedforward neural network
  - accuracy: `0.8246`
  - ROC-AUC: `0.9025`
- Descriptor-graph prototype
  - accuracy: `0.6967`
  - ROC-AUC: `0.7689`
- More complex models did not automatically improve performance

**What to say:**
The feedforward neural network was a valid extension, but it did not beat the stronger classical models. The descriptor-graph prototype performed even worse. That ended up being an important lesson: increasing model complexity does not help if the representation is not well matched to the problem. Since the graph was induced from descriptor correlations rather than real chemistry, the graph-based approach was limited from the start.

---

## Slide 7: Cross-Environment Validation

**Use figure:** [cross_environment_validation.png](assets/cross_environment_validation.png)

**Slide bullets:**
- Created 3 proxy environments using descriptor-space clustering
- Tested leave-one-environment-out validation
- Mean held-out accuracy:
  - Logistic Regression: `0.3727`
  - Random Forest: `0.4210`
  - FNN: `0.3532`
  - GNN prototype: `0.3688`
- Generalization dropped hard under shifted distributions

**What to say:**
This was one of the most important turning points in the project. Instead of only testing on a standard split, I created proxy environments using clustered descriptor space and tested whether the learned patterns would transfer. Performance dropped sharply for every model. This showed that the real bottleneck was generalization, not just in-distribution accuracy.

---

## Slide 8: Validation Repair and Feature Engineering

**Use figure:** [feature_engineering_comparison.png](assets/feature_engineering_comparison.png)

**Slide bullets:**
- Repaired validation with 5-fold stratified cross-validation
- Added SMOTE only on training folds
- Added chemistry-aware proxy features:
  - heteroatom counts
  - polarity proxy
  - mass-topology proxy
  - ring-topology proxy
- Best feature-engineering combination:
  - Tier 1 + Tier 2 with FNN and SMOTE
  - accuracy: `0.8758`
  - RB recall: `0.8399`

**What to say:**
After seeing the cross-environment drop, I made sure the validation pipeline itself was correct and stable. Then I expanded the original descriptor set with chemistry-aware proxy features that were still realistic to compute in this project. These new features did help in some settings, especially for recall, but they did not fully solve the generalization problem.

---

## Slide 9: Feature Importance and Feature Selection

**Use figure:** [feature_importance.png](assets/feature_importance.png)

**Slide bullets:**
- Top-ranked features included:
  - `SpMax_B_m`
  - `SpMax_L`
  - `SM6_B_m`
  - `SpPosA_B_p`
  - `mass_topology_proxy`
  - `polarity_proxy`
- Tested four feature sets:
  - `full_enhanced`
  - `top_ranked`
  - `reduced_hybrid`
  - `proxy_only`
- `proxy_only` was clearly weakest
- Reduced feature sets stayed competitive

**What to say:**
Feature selection asked whether all features were equally useful. They were not. Some of the strongest signals came from a smaller set of descriptors, and a few of the chemistry-aware proxies also showed up as meaningful. This was important because it showed that feature reduction did not necessarily hurt performance and might actually improve reliability later on.

---

## Slide 10: Uncertainty and Calibration

**Use figures:**  
[calibration_curve.png](assets/calibration_curve.png)  
[selective_accuracy.png](assets/selective_accuracy.png)

**Slide bullets:**
- Measured:
  - confidence
  - uncertainty
  - entropy
  - Brier score
  - ECE
  - log loss
- Best overall calibrated Random Forest feature set: `top_ranked`
- Wrong predictions were usually more uncertain in-distribution
- Under cross-environment shift, some models stayed confidently wrong

**What to say:**
The uncertainty analysis moved the project into reliability analysis. I wanted to know whether the model understood when it might be wrong. In standard validation, uncertainty was often meaningful, because wrong predictions usually had higher uncertainty than correct ones. But under cross-environment shift, that behavior weakened. Some models became overconfident even when they were wrong, which is a serious reliability issue.

---

## Slide 11: Final Model Selection

**Use figures:**  
[model_reliability_scoreboard.png](assets/model_reliability_scoreboard.png)  
[accuracy_calibration_tradeoff.png](assets/accuracy_calibration_tradeoff.png)

**Slide bullets:**
- Final ranking combined:
  - accuracy
  - calibration
  - uncertainty behavior
  - selective prediction
  - cross-environment robustness
- Final recommended model:
  - `top_ranked | random_forest_classifier`
  - reliability score: `0.8860`
- Best cross-environment raw accuracy:
  - `top_ranked | logistic_regression`
  - `0.6455`

**What to say:**
The final model was not chosen by accuracy alone. Instead, I built a reliability score that combined the factors that mattered most by the end of the project. The final recommendation was the Random Forest on the top-ranked feature set. It was not the winner in every single category, but it gave the best overall balance between performance and trustworthiness.

---

## Slide 12: Final Takeaways

**Slide bullets:**
- Random Forest remained the most dependable family overall
- Reduced top-ranked features worked better than I expected
- The biggest weakness was still generalization under distribution shift
- Reliability mattered more than raw performance in the final decision
- Final conclusion:
  - the best model is the one that is accurate, calibrated, and defensible

**What to say:**
The biggest lesson from this project is that a strong model is not just one that scores well on a convenient split. A stronger model is one that still makes sense when you look at calibration, uncertainty, and shifted conditions. That is why the final choice was based on reliability, not just the highest single accuracy number.

---

## Optional Slide 13: Limitations and Next Steps

**Slide bullets:**
- Dataset was descriptor-based, not a true polymer graph dataset
- No continuous degradation-rate constants available
- No true pathway labels like oxidation or hydrolysis
- Future work:
  - true polymer graph data
  - better environment labels
  - calibrated uncertainty methods
  - external validation on a second dataset

**What to say:**
There are still some real limitations. This dataset was useful, but it did not support every original project goal. If I continued this work, the next priority would be moving to a dataset with real polymer graph structure, stronger chemistry labels, and external validation so that the reliability results could be tested more realistically.
