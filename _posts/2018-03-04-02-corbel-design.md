---
    layout: post
    title: Design of Reinforced Concrete Corbels
    category:
        - Advance Concrete Design
        - Python
    mathjax: true
---
by:**Jan Alexis Monsalud**

Design references:
1. Building Code Requirements for Structural Concrete and Commentay (ACI 318M-14 and ACI 318RM-14)
  1. Section 16.5: Brackets and Corbels
  2. Section 22.9: Shear Friction
2. Simplified Reinforced Concrete Design (Gillesania)
3. Design of Concrete Structures 7e (Nilson et.al)

## Problem Description

Design a corbel attached to one side of a 16 in.  by 16 in. (400 mm by 400 mm) concrete column. The corbel is to support a vertical load of 35 kips (155 kN) dead load and 65 kips (290 kN) live load. The reaction is located 5 in. (125 mm) from the column face ($a_v$). Use $f'_c=5$ ksi (35 MPa) and $f_y=60$ ksi (415 MPa). 

**CASE 1:** Suitable bearings are provided, so horizontal restraint is negligible ($N_{uc} = 0$)

**CASE 2:** No suitable bearings are provided ($N_{uc} = 0.20V_u$)

<p style="page-break-after:always;"></p>

## Parts of the Corbel to be Designed
![png](/images/02-corbel-design/corbel.png)

## Design Steps (Shear Friction Method)
1. Solve for the required depth and overall thickness of the corbel
2. Area of tension steel
3. Area of shear reinforcement
4. Area of flexural reinforcement
5. Area of primary reinforcement
6. Area of closed stirrups

<p style="page-break-after:always;"></p>

## Design Data


```python
import math
''' Corbel Design Data '''
# strength reduction factor for shear
phi = 0.75
# Ultimate shear load [kN]
Vu = 1.2*155 + 1.6*290
# Horizontal force [kN]
T = 0
# shear span [mm]
av = 125
# width of corbel [mm]
# usually equal to the column width
b = 400
# concrete compressive strength [MPa]
fc = 35
# yield strength of steel [MPa]
fy = 415
# bearing plate cover thickness [mm]
cc = 10
# tension bar diameter [mm]
d1 = 28
# stirrup diameter [mm]
d2 = 10
# coefficient of friction (ACI Table 22.9.4.2)
mu = 1.4
```

## 1. Determination of Required Depth, d


```python
''' Nominal Direct Shear '''
#  Nomimal direct shear [kN]
Vn = Vu/phi
print("Vn : {0} kN".format(Vn))
```

    Vn : 866.666666667 kN


According to ACI 16.5.2.4, the dimensions shall be selected such than $V_n$ shall not exceed the following:
1. $ 0.2f'_cb_wd $
2. $ (3.3 + 0.08f'_c)b_wd $
3. $ 11b_wd $

Using these provisions, we can solve for $d$

$$
d = V_n \div \min
\begin{Bmatrix}
0.2f'_c, \\
3.3+0.08f'_c\\
11
\end{Bmatrix}
$$


```python
''' Required Depth [mm]'''
d = Vn*1000/(min(0.2*fc, 3.3+0.08*fc,11)*b)
print("Minimum required depth: {0} mm".format(d))
```

    Minimum required depth: 355.191256831 mm


We adjust the required depth and add the depth of the concrete/plate cover and half the diameter of the tension bar.


```python
''' Total Depth '''
h = d + 0.5*d1 + cc
h = math.ceil(h/10)*10
print("Total depth, h: {0} mm".format(h))

d = h - 0.5*d1 - cc
print("Adjusted effective depth, d: {0} mm".format(d))
```

    Total depth, h: 380.0 mm
    Adjusted effective depth, d: 356.0 mm


ACI provision stipulated in section 16.5 are only applicable for corbels with dimensions in which $\frac{a_v}{d} \leq 1.0$ (16.5.1.1)


```python
print("Is av/d ({0}) <= 1.0? {1}".format(av/d,av/d<=1.0))
```

    Is av/d (0.351123595506) <= 1.0? True


## 2. Area of Tension Reinforcement

For the first case, we simply neglect the tension reinforcement.

For the second case, the horizontal load, $N_{uc}$, shall be considered as a live load and shall be factored as such (ACI 16.5.3.4). The minimum $N_{uc}$ shall be at least $0.2V_u$ (ACI 16.5.3.5).


```python
''' Horizontal Load '''
Nuc1 = 0
print("Factored horizontal force (CASE 1), Nuc1: {0} kN".format(Nuc1))

Nuc2 = max(0.2*Vu, 1.6*T)
# Note: for this problem, Nuc2 is given explicitly as 0.2*Vu
Nuc2 = 0.2*Vu
print("Factored horizontal force (CASE 2), Nuc2: {0} kN".format(Nuc2))
```

    Factored horizontal force (CASE 1), Nuc1: 0 kN
    Factored horizontal force (CASE 2), Nuc2: 130.0 kN


The design is only valid for $N_{uc} \leq V_u$


```python
print("Is Nuc1({0} kN) <= Vu({1} kN)? {2}".format(Nuc1,Vu,Nuc1<=Vu))
print("Is Nuc2({0} kN) <= Vu({1} kN)? {2}".format(Nuc2,Vu,Nuc2<=Vu))
```

    Is Nuc1(0 kN) <= Vu(650.0 kN)? True
    Is Nuc2(130.0 kN) <= Vu(650.0 kN)? True


We now compute for the area of the tension reinforcement (ACI 16.5.4.3)

$$
N_{uc} = \phi A_nf_y
$$


```python
''' Tension Reinforcement '''
An1 = 0
print("Required tension reinforcement (CASE 1), An1: {0} mm^2"
      .format(An1))
An2 = 1000*Nuc2/(phi*fy)
print("Required tension reinforcement (CASE 2), An2: {0} mm^2"
      .format(An2))
```

    Required tension reinforcement (CASE 1), An1: 0 mm^2
    Required tension reinforcement (CASE 2), An2: 417.670682731 mm^2


## 3. Area of Shear Reinforcement
The shear reinforcement shall have a strength computed in accordance to ACI 16.5.4.4 and 22.9.4.2.

$$ V_n = \mu A_{vf}f_y $$


```python
''' Shear Friction Reinforcement '''
Avf = 1000*Vu/(phi*mu*fy)
print("Required shear reinforcement, Avf: {0} mm^2".format(Avf))
```

    Required shear reinforcement, Avf: 1491.68100975 mm^2


## 4. Area of Flexural Reinforcement
First, we solve for the factored moment (ACI 16.5.3.1)

$$ M_u = V_ua_v + N_{uc}(h-d) $$


```python
''' Factored Moment '''
Mu1 = (Vu*av + Nuc1*(h-d))/1000
print("Factored Moment (CASE 1), Mu1: {0} kN-m".format(Mu1))
Mu2 = (Vu*av + Nuc2*(h-d))/1000
print("Factored Moment (CASE 2), Mu2: {0} kN-m".format(Mu2))
```

    Factored Moment (CASE 1), Mu1: 81.25 kN-m
    Factored Moment (CASE 2), Mu2: 84.37 kN-m


We solve the required flexural reinforcement using the following relation:

$$ M_u = \phi A_ff_y(d-a/2) $$

take the quantity $(d-a/2) = 0.9d$ as a conservative estimate

$$ A_f = \frac{M_u}{\phi f_y (0.9d)} $$


```python
''' Flexural Reinforcement '''
Af1 = Mu1*1e6 / (phi*fy*0.9*d)
print("Required flexural reinforcement (CASE 1), Af1: {0} mm^2"
      .format(Af1))
Af2 = Mu2*1e6 / (phi*fy*0.9*d)
print("Required flexural reinforcement (CASE 2), Af2: {0} mm^2"
      .format(Af2))
```

    Required flexural reinforcement (CASE 1), Af1: 814.744621432 mm^2
    Required flexural reinforcement (CASE 2), Af2: 846.030814895 mm^2


## 5. Area of Primary Reinforcements
The primary reinforcements shall be at least the greatest of the following:
1. $A_f+A_n$
2. $\cfrac{2}{3}A_{vf}+A_n$
3. $0.04\left ( \cfrac{f'_c}{f_y} \right) b_wd$


```python
''' Area of Primary Reinforcement'''
Asc1 = max(Af1+An1,2.0/3.0*Avf+An1,0.04*fc/fy*b*d)
print("Required primary reinforcement (CASE 1), Asc1: {0} mm^2"
      .format(Asc1))
Asc2 = max(Af2+An2,2.0/3.0*Avf+An2,0.04*fc/fy*b*d)
print("Required primary reinforcement (CASE 2), Asc2: {0} mm^2"
      .format(Asc2))
```

    Required primary reinforcement (CASE 1), Asc1: 994.454006502 mm^2
    Required primary reinforcement (CASE 2), Asc2: 1412.12468923 mm^2


The number of bars can now be computed


```python
N1 = math.ceil(4*Asc1/(math.pi*d1**2))
print("(CASE 1) Use {0}-{1} mm primary bars.".format(int(N1),d1))
N2 = math.ceil(4*Asc2/(math.pi*d1**2))
print("(CASE 2) Use {0}-{1} mm primary bars.".format(int(N2),d1))
```

    (CASE 1) Use 2-28 mm primary bars.
    (CASE 2) Use 3-28 mm primary bars.


## 6. Area of Closed Stirrups
The total area of closed stirrups parallel to primary tension reinforcement shall be at least (ACI 16.5.5.2):

$$ A_h = 0.5(A_{sc} - A_n) $$


```python
''' Area of Closed Stirrups '''
Ah1 = 0.5*(Asc1 - An1)
print("Required area of stirrups (CASE 1), Ah1: {0} mm^2".format(Ah1))
Ah2 = 0.5*(Asc2 - An2)
print("Required area of stirrups (CASE 2), Ah2: {0} mm^2".format(Ah2))
```

    Required area of stirrups (CASE 1), Ah1: 497.227003251 mm^2
    Required area of stirrups (CASE 2), Ah2: 497.227003251 mm^2


The number of closed stirrups is solve using the given diameter


```python
# Stirrup shear area
Av = 2*math.pi/4*d2**2
S1 = math.ceil(Ah1/Av)
print("(CASE 1) Use {0}-{1} mm closed stirrups.".format(int(S1),d2))
S2 = math.ceil(Ah2/Av)
print("(CASE 2) Use {0}-{1} mm closed stirrups.".format(int(S2),d2))
```

    (CASE 1) Use 4-10 mm closed stirrups.
    (CASE 2) Use 4-10 mm closed stirrups.


Distribute the stirrups uniformly within $\cfrac{2}{3}d$ adjacent to primary reinforcement.


```python
print("Spacing of stirrups: {0} mm".format(round(2.0/90*d)*10))
```

    Spacing of stirrups: 80.0 mm


## Summary of Design
The designs for both cases are almost the same except for the number of primary bars. Two (2) for the first case but three (3) for the second case because of the presence of tension in the latter.

![case1](/images/02-corbel-design/corbel1.png)![case1](/images/02-corbel-design/corbel2.png)
