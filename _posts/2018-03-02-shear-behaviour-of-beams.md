---
    layout: post
    title: Shear in Beams
    category:
        - Notes
        - Advance Concrete Design
        - Python
    mathjax: true
---
*Problem Set 2 in Advance Design of Reinforced Concrete*

by:**Jan Alexis Monsalud**

## Problem Description

Given the following beam section:

<div style="clear:both;display:table;">
    <div style="float: left; width: 60%;">
        <img src="/assets/img/01.png" alt="" style="width: 50%;"/>
    </div>
    <div style="float: right; width: 40%;">
    $$
        \begin{aligned}
        A_s &= 5500 \ \text{mm}^2\\
        f'_c &= 20 \ \text{MPa} \\
        f_y = f_v &= 276 \ \text{MPa}\\
        \rho_w &= \frac{5500}{540 \times 400} = 0.025\\
        L &= 6 \ \text{m}
        \end{aligned}
        $$
    </div>
</div>

<img src="/assets/img/02.png" alt="" style="width: 50%;"/>


Analyze the shear capacity of the concrete and compare it with the shear loading applied.

## Solution

### Shear and Moment Values
**Note**: *Since the beam is symmetrical, we analyze only the left part of the beam.*

We start by computing for the shear and moment at various points. The values for the shear will be the shear loading that we need to compare the concrete capacity to.


```python
import numpy as np
import math
import matplotlib.pyplot as plt
''' First we assign the given values to their
    corresponding variables.
'''
wu  = 120 # Applied distributed load
L   = 6  # Length of Beam
As  = 5500   # Area of steel provided
fc  = 20     # Compressive strength of concrete
fy  = 276    # Tensile strength of flexural steel
fv  = 276    # Tensile stregth of stirrups
rw  = 0.025  # Tensile steel ratio
b   = 400    # Beam width
d   = 540    # Effective depth
la  = 1.0    # light-weight/normal-weight concrete factor
```


```python
R = 0.5*wu*L                # First we solve for the reactions
x = np.linspace(0.01,L/2)   # We pick equally spaced points

Vu = R - wu*x   # This is the shear equation, it now contains
                # the shear values of the points we picked.
print("Vu:")
print(Vu)
```

    Vu:
    [358.8        351.47755102 344.15510204 336.83265306 329.51020408
     322.1877551  314.86530612 307.54285714 300.22040816 292.89795918
     285.5755102  278.25306122 270.93061224 263.60816327 256.28571429
     248.96326531 241.64081633 234.31836735 226.99591837 219.67346939
     212.35102041 205.02857143 197.70612245 190.38367347 183.06122449
     175.73877551 168.41632653 161.09387755 153.77142857 146.44897959
     139.12653061 131.80408163 124.48163265 117.15918367 109.83673469
     102.51428571  95.19183673  87.86938776  80.54693878  73.2244898
      65.90204082  58.57959184  51.25714286  43.93469388  36.6122449
      29.28979592  21.96734694  14.64489796   7.32244898   0.        ]



```python
Mu = R*x - 0.5*wu*x**2  # The moment equation for the beam
print("Mu:")
print(Mu)
```

    Mu:
    [  3.594       25.26471304  46.48860725  67.26568263  87.59593919
     107.47937693 126.91599584 145.90579592 164.44877718 182.54493961
     200.19428322 217.396808   234.15251395 250.46140108 266.32346939
     281.73871887 296.70714952 311.22876135 325.30355435 338.93152853
     352.11268388 364.84702041 377.13453811 388.97523698 400.36911703
     411.31617826 421.81642066 431.86984423 441.47644898 450.6362349
     459.349202   467.61535027 475.43467972 482.80719034 489.73288213
     496.2117551  502.24380925 507.82904456 512.96746106 517.65905873
     521.90383757 525.70179758 529.05293878 531.95726114 534.41476468
     536.4254494  537.98931529 539.10636235 539.77659059 540.        ]


## Shear Capacity of Concrete
For non-prestressed members without axial force,the shear capacity of concrete can be taken as the least of the following values (from ACI 318-14 Table 22.5.5.1):

$$
\begin{aligned}
V_c &= \left ( 0.16\lambda\sqrt{f'_c}+17\rho_w\frac{V_ud}{M_u}\right )b_wd \\
V_c &= \left ( 0.16\lambda\sqrt{f'_c}+17\rho_w\right )b_wd \quad \text{or}\\
V_c &= 0.29\lambda\sqrt{f'_c}b_wd
\end{aligned}
$$

```python
''' Calcuation of values from ACI '''
Vc1 = (0.16*la*fc**0.5 + 17*rw*((Vu*d)/(1000*Mu)))*b*d/1e3
Vc2 = (0.16*la*fc**0.5 + 17*rw)*b*d/1e3
Vc3 = 0.29*la*fc**0.5*b*d/1e3

Vc = np.minimum(Vc1,min(Vc2,Vc3))

print("Vc:")
print(Vc)
```

    Vc:
    [246.3570186  246.3570186  246.3570186  246.3570186  246.3570186
     246.3570186  246.3570186  246.3570186  245.0564819  234.09654276
     225.2710718  218.00579174 211.91524245 206.73106144 202.26064554
     198.36216913 194.92887539 191.87885883 189.14822277 186.68637899
     184.45274593 182.41438285 180.5442643  178.82000134 177.22288027
     175.73713026 174.3493589  173.04811217 171.82352801 170.66706093
     169.57126125 168.52959656 167.53630631 166.5862824  165.67497047
     164.79828782 163.95255449 163.13443523 162.3408902  161.56913275
     160.81659313 160.08088696 159.35978767 158.65120211 157.95314896
     157.26373911 156.58115792 155.90364875 155.22949764 154.5570186 ]


### Plotting of Results


```python
plt.plot(x,Vu)
plt.plot(x,Vc)
plt.show()
```


![png](/images/2018-03-02-shear-behaviour-of-beams_13_0.png)


### Steel Area
We can get the difference in areas of the curves and relate this to the average spacing required for the stirrups.


```python
# First we get the difference of y values of Vu and Vc.
# Values less than zero are ignored.
diff = np.maximum(np.zeros(Vu.shape),Vu - Vc)

# The trapezoidal rule of integration is applied
area = np.trapz(diff, x)

print("Difference in Area: {0} kN-m".format(area))
```

    Difference in Area: 81.6693295161 kN-m



```python
# We find the x value where Vu = Vc (almost)
i = diff.tolist().index(0)

# The average is computed as the difference in area over the length
Vs_ave = area/x[i-1]

print("Average required Vs: {0} kN".format(Vs_ave))
```

    Average required Vs: 53.1870965748 kN


We now solve for the average spacing using the relation for nonprestressed members:

$$
\begin{aligned}
s &= \frac{A_sf_vd}{V_s}\\
s_{max} &= \frac{d}{2} \leq 600 \ \text{ when } \ V_s \leq 0.33\sqrt{f'_c}b_wd \\
s_{max} &= \frac{d}{4} \leq 300 \ \text{ when } \ V_s > 0.33\sqrt{f'_c}b_wd
\end{aligned}
$$


```python
# using two-legged 10mm stirrups we have:
dv = 10
n = 2
Asv = np.pi*0.25*n*dv**2

Vs = Vs_ave*1000
c = 0.33*np.sqrt(fc)*b*d
s_max=0
if Vs <= c:
    s_max = min(d/2,600)
else:
    s_max = min(d/4,400)

s = min(Asv*fv*d/Vs,s_max)

print("Average spacing required: {0} mm".format(s))
```

    Average spacing required: 270 mm