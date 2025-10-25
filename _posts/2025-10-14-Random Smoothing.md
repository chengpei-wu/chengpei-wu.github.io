---
layout: blog_post
title: Understanding Random Smoothing
date: 2025-10-14
tag: [robust machine learning, certified robustness, random smoothing]
author: Chengpei Wu
excerpt: This post provides an introduction to Random Smoothing.
---

## 1. Introduction

Random Smoothing is a technique used in robust machine learning to enhance the certified robustness of classifiers. The main idea is to add random noise to the input data and then smooth the classifier's output over this noise distribution. This approach can help in obtaining stronger robustness guarantees against adversarial attacks.
