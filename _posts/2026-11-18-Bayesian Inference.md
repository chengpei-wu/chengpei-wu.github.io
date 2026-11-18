---
layout: blog_post
title: Bayesian Inference
date: 2026-11-12
tag: [statistical learning, Bayesian inference]
author: Chengpei Wu
excerpt: This post provides an introduction to Bayesian Inference.
---

## 1. Introduction

Bayesian inference is a statistical inference framework. It represents existing knowledge through prior distributions, updates the probability distributions of parameters using observed data, and performs estimation, prediction, and decision-making based on posterior distributions.

## 2. Notation

To facilitate the introduction, we introduce the following notations:
Let $$\mathcal{D}=\{(x_i,y_i)\}_{i=1}^{N}$$ denote the observed dataset, where $$x_i \in \mathcal{X}$$ and $$y_i\in\mathcal{Y}$$ represent the input and output of the $$i$$-th observation, respectively. We use $$\boldsymbol{\theta}\in\Theta$$ to denote the prior, which represents our initial probabilistic assumptions about the unknown parameters of the data-generating mechanism, with $$p(\boldsymbol{\theta})$$ representing the prior distribution. The likelihood of the observed data is denoted by $$p(\mathcal{D}\mid\boldsymbol{\theta})$$, and the posterior distribution is written as $$p(\boldsymbol{\theta}\mid\mathcal{D})$$. For a new input $$x_*$$, let $$y_*$$ denote its corresponding unknown output. We use $$p(y_* \mid x_*,\boldsymbol{\theta})$$ to represent the conditional predictive distribution given the prior, and $$p(y_*\mid x_*,\mathcal{D})$$ to denote the posterior predictive distribution obtained by marginalizing over the parameter posterior. Throughout, $$p(\cdot)$$ denotes a probability mass function or probability density function, as appropriate.

## 3. A deeper look at **prior**, **likelihood**, and **posterior** in Bayesian Statistics.

- **Unknown Parameter**: 
- **Prior**: The prior distribution $$p(\boldsymbol{\theta})$$ represents our initial beliefs about the parameters before observing any data. It can be based on previous knowledge, expert opinion, or assumptions about the problem domain. The choice of prior can significantly influence the results of Bayesian inference, especially when the amount of data is limited.