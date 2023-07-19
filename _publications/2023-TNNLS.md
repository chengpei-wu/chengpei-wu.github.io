---
title: "Network Robustness Prediction: Influence of Training Data Distributions"
collection: publications
permalink: /publication/2023-TNNLS
excerpt: 'This paper investigates the influence of training data distributions for predicting network robustness.'
date: 2023-5-23
venue: 'IEEE Transactions on Neural Networks and Learning Systems'

---
## Abstract: 

Network robustness refers to the ability of a network to continue its functioning against malicious attacks, which is critical for various natural and industrial networks. Network robustness can be quantitatively measured by a sequence of values that record the remaining functionality after a sequential node-or edge-removal attacks. Robustness evaluations are traditionally determined by attack simulations, which are computationally very time-consuming and sometimes practically infeasible. The convolutional neural network (CNN)-based prediction provides a cost-efficient approach to fast evaluating the network robustness. In this article, the prediction performances of the learning feature representation-based CNN (LFR-CNN) and PATCHY-SAN methods are compared through extensively empirical experiments. Specifically, three distributions of network size in the training data are investigated, including the uniform, Gaussian, and extra distributions. The relationship between the CNN input size and the dimension of the evaluated network is studied. Extensive experimental results reveal that compared to the training data of uniform distribution, the Gaussian and extra distributions can significantly improve both the prediction performance and the generalizability, for both LFR-CNN and PATCHY-SAN, and for various functionality robustness. The extension ability of LFR-CNN is significantly better than PATCHY-SAN, verified by extensive comparisons on predicting the robustness of unseen networks. In general, LFR-CNN outperforms PATCHY-SAN, and thus LFR-CNN is recommended over PATCHY-SAN. However, since both LFR-CNN and PATCHY-SAN have advantages for different scenarios, the optimal settings of the input size of CNN are recommended under different configurations.

## Citation:

```
@article{10130828,
  author={Lou, Yang and Wu, Chengpei and Li, Junli and Wang, Lin and Chen, Guanrong},
  journal={IEEE Transactions on Neural Networks and Learning Systems}, 
  title={Network Robustness Prediction: Influence of Training Data Distributions}, 
  year={2023},
  volume={},
  number={},
  pages={1-12},
  doi={10.1109/TNNLS.2023.3269753}
}
```

Paper [Download](https://ieeexplore.ieee.org/document/10130828)